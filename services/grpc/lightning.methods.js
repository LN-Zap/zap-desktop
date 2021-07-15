import { decodePayReq as bolt11DecodePayReq, getTag } from '@zap/utils/crypto'
import { grpcLog } from '@zap/utils/log'
import promisifiedCall from '@zap/utils/promisifiedCall'

import { logGrpcCmd } from './helpers'

// ------------------------------------
// Wrappers / Overrides
// ------------------------------------

/**
 * getInfo - Call lnd grpc getInfo method.
 *
 * @param {object} payload Payload
 * @param {object} options Grpc call options
 * @returns {Promise} GetInfoResponse
 */
async function getInfo(payload = {}, options = {}) {
  logGrpcCmd('Lightning.getInfo', payload)
  const infoData = await promisifiedCall(this.service, this.service.getInfo, payload, options)

  // Add grpc proto version into info so that it can be used by the client.
  infoData.grpcProtoVersion = this.version

  // In older versions `chain` was a simple string and there was a separate boolean to indicate the network.
  // Convert it to the current format for consistency.
  if (typeof infoData.chains[0] === 'string') {
    const chain = infoData.chains[0]
    const network = infoData.testnet ? 'testnet' : 'mainnet'
    delete infoData.testnet
    infoData.chains = [{ chain, network }]
  }

  return infoData
}

/**
 * hasMethod - Checks whether specified method is present in gRPC interface.
 *
 * @param {string} method Name of method to check for
 * @returns {boolean} True if specified method exists withing service
 */
function hasMethod(method) {
  return Boolean(this.service[method])
}

/**
 * estimateFee - Estimates on-chain fee.
 *
 * @param {string} address Address
 * @param {number} amount Amount in satoshis
 * @param {number} targetConf Desired confirmation time
 * @returns {Promise} EstimateFeeResponse
 */
async function estimateFee(address, amount, targetConf) {
  const payload = { AddrToAmount: { [address]: amount }, targetConf }
  logGrpcCmd('Lightning.estimateFee', payload)
  return promisifiedCall(this.service, this.service.estimateFee, payload)
}

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * getBalance - Call lnd grpc walletBalance and channelBalance method and combine result.
 *
 * @returns {Promise} Data about all balances
 */
async function getBalance() {
  const [walletBalance, channelBalance] = await Promise.all([
    this.walletBalance(),
    this.channelBalance(),
  ])

  return {
    walletBalance,
    channelBalance,
  }
}

/**
 * getChannels - Call lnd grpc listChannels, pendingChannels and closedChannels method and combine result.
 *
 * @returns {Promise<object>} Data about all channels
 */
async function getChannels() {
  const [channels, pendingChannels, closedChannels] = await Promise.all([
    this.listChannels(),
    this.pendingChannels(),
    this.closedChannels(),
  ])

  return {
    channels,
    pendingChannels,
    closedChannels,
  }
}

/**
 * ensurePeerConnected - Call lnd grpc connectPeer method if not already connected to the peer.
 *
 * @param {object} payload Payload
 * @returns {Promise} ConnectPeerResponse
 */
async function ensurePeerConnected(payload = {}) {
  const { peers } = await this.listPeers()
  const peer = peers.find(candidatePeer => candidatePeer.pubKey === payload.pubkey)
  if (peer) {
    return peer
  }
  const finalPayload = { addr: payload }
  logGrpcCmd('Lightning.connectPeer', finalPayload)
  return this.connectPeer(finalPayload)
}

/**
 * connectAndOpen - Connect to peer and open a channel.
 *
 * @param {object} payload Payload
 * @returns {Promise} OpenStatusUpdate
 */
async function connectAndOpen(payload = {}) {
  logGrpcCmd('Lightning.connectAndOpen', payload)
  const {
    pubkey,
    host,
    localamt,
    private: privateChannel,
    satPerByte,
    remoteCsvDelay,
    spendUnconfirmed,
  } = payload
  const req = {
    nodePubkey: Buffer.from(pubkey, 'hex'),
    localFundingAmount: Number(localamt),
    private: privateChannel,
    satPerByte,
    remoteCsvDelay,
    spendUnconfirmed,
  }
  try {
    await this.ensurePeerConnected({ pubkey, host })
  } catch (e) {
    const error = new Error(e.message)
    error.payload = { ...req, nodePubkey: pubkey }
    return Promise.reject(error)
  }
  return this.openChannel(req)
}

/**
 * openChannel - Call lnd grpc openChannel method.
 *
 * @param {object} payload Payload
 * @returns {Promise} OpenStatusUpdate
 */
async function openChannel(payload = {}) {
  const parsePayload = () => ({
    ...payload,
    nodePubkey: Buffer.from(payload.nodePubkey).toString('hex'),
  })
  return new Promise((resolve, reject) => {
    try {
      logGrpcCmd('Lightning.openChannel', payload)
      const call = this.service.openChannel(payload)

      call.on('data', data => {
        grpcLog.debug('OPEN_CHANNEL DATA', data)
        const response = { ...parsePayload(payload), data }
        resolve(response)
      })

      call.on('error', error => {
        grpcLog.error('OPEN_CHANNEL ERROR', error)
        const e = new Error(error.details || error.message)
        e.payload = parsePayload(payload)
        reject(e)
      })

      call.on('status', s => {
        grpcLog.debug('OPEN_CHANNEL STATUS', s)
      })

      call.on('end', () => {
        grpcLog.debug('OPEN_CHANNEL END')
      })
    } catch (e) {
      const error = new Error(e.message)
      error.payload = payload
      throw error
    }
  })
}

/**
 * closeChannel - Call lnd grpc closeChannel method.
 *
 * @param {object} payload Payload
 * @returns {Promise} CloseStatusUpdate
 */
async function closeChannel(payload = {}) {
  return new Promise((resolve, reject) => {
    try {
      const {
        channelPoint: { fundingTxid, outputIndex },
        chanId,
        force,
        targetConf,
      } = payload
      const tx = fundingTxid
        .match(/.{2}/g)
        .reverse()
        .join('')

      const req = {
        channelPoint: {
          fundingTxidBytes: Buffer.from(tx, 'hex'),
          outputIndex: Number(outputIndex),
        },
        force,
        targetConf,
      }
      logGrpcCmd('Lightning.closeChannel', req)
      const call = this.service.closeChannel(req)

      call.on('data', data => {
        grpcLog.debug('CLOSE_CHANNEL DATA', data)
        const response = { data, chanId }
        resolve(response)
      })

      call.on('error', error => {
        grpcLog.error('CLOSE_CHANNEL ERROR', error)
        const e = new Error(error.details || error.message)
        e.payload = { chanId }
        reject(e)
      })

      call.on('status', s => {
        grpcLog.debug('CLOSE_CHANNEL STATUS', s)
      })

      call.on('end', () => {
        grpcLog.debug('CLOSE_CHANNEL END')
      })
    } catch (e) {
      const error = new Error(e.message)
      error.payload = payload
      throw error
    }
  })
}

/**
 * sendPayment - Call lnd grpc sendPayment method.
 *
 * @param {object} payload Payload
 * @returns {Promise} Original payload augmented with lnd sendPayment response data.
 */
async function sendPayment(payload = {}) {
  // Our response will always include the original payload.
  const res = { ...payload }

  return new Promise((resolve, reject) => {
    try {
      logGrpcCmd('Lightning.sendPayment', payload)
      const call = this.service.sendPayment(payload)

      call.on('data', data => {
        // Convert paymentHash to hex string.
        if (data.paymentHash) {
          data.paymentHash = data.paymentHash.toString('hex')
        }
        // In some cases lnd does not return the paymentHash. If this happens, retrieve it from the invoice.
        else {
          const invoice = bolt11DecodePayReq(payload.paymentRequest)
          data.paymentHash = getTag(invoice, 'payment_hash')
        }

        // Convert the preimage to a hex string.
        data.paymentPreimage = data.paymentPreimage && data.paymentPreimage.toString('hex')

        // Add lnd return data, as well as payment preimage and hash as hex strings to the response.
        Object.assign(res, data)

        // Payment success is determined by the absense of a payment error.
        const isSuccess = !res.paymentError
        if (isSuccess) {
          grpcLog.debug('PAYMENT SUCCESS', res)
          resolve(res)
        }

        // In case of an error, notify the client if there was a problem sending the payment.
        else {
          grpcLog.error('PAYMENT ERROR', res)
          const error = new Error(res.paymentError)
          error.details = res
          reject(error)
        }
        call.end()
      })

      call.on('status', s => {
        grpcLog.debug('PAYMENT STATUS', s)
      })

      call.on('end', () => {
        grpcLog.debug('PAYMENT END')
      })

      call.write(payload)
    } catch (e) {
      const error = new Error(e.message)
      error.details = res
      throw error
    }
  })
}

export default {
  getInfo,
  getBalance,
  getChannels,
  ensurePeerConnected,
  connectAndOpen,
  openChannel,
  closeChannel,
  sendPayment,
  estimateFee,
  hasMethod,
}
