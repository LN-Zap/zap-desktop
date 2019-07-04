import promisifiedCall from '@zap/utils/promisifiedCall'
import { decodePayReq as bolt11DecodePayReq } from '@zap/utils/crypto'
import { grpcLog } from '@zap/utils/log'
import { logGrpcCmd } from './helpers'

// ------------------------------------
// Wrappers / Overrides
// ------------------------------------

/**
 * getInfo - Call lnd grpc getInfo method.
 *
 * @param {object} payload Payload
 * @returns {Promise} GetInfoResponse
 */
async function getInfo(payload = {}) {
  logGrpcCmd('Lightning.getInfo', payload)
  const infoData = await promisifiedCall(this.service, this.service.getInfo, payload)

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
  const payload = { AddrToAmount: { [address]: amount }, target_conf: targetConf }
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
 * createInvoice - Call lnd grpc createInvoice method.
 *
 * @param {object} payload Payload
 * @returns {Promise} Invoice decorated with additional info
 */
async function createInvoice(payload = {}) {
  const invoice = await this.addInvoice(payload)
  const decodedInvoice = await this.decodePayReq({ pay_req: invoice.payment_request })
  return {
    ...decodedInvoice,
    memo: payload.memo,
    value: payload.value,
    private: payload.private,
    r_hash: Buffer.from(invoice.r_hash, 'hex').toString('hex'),
    payment_request: invoice.payment_request,
    creation_date: Date.now() / 1000,
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
  const peer = peers.find(candidatePeer => candidatePeer.pub_key === payload.pubkey)
  if (peer) {
    return peer
  }
  return this.connectPeer({ addr: payload })
}

/**
 * connectAndOpen - Connect to peer and open a channel.
 *
 * @param {object} payload Payload
 * @returns {Promise} OpenStatusUpdate
 */
async function connectAndOpen(payload = {}) {
  const { pubkey, host, localamt, private: privateChannel, satPerByte, spendUnconfirmed } = payload
  const req = {
    node_pubkey: Buffer.from(pubkey, 'hex'),
    local_funding_amount: Number(localamt),
    private: privateChannel,
    sat_per_byte: satPerByte,
    spend_unconfirmed: spendUnconfirmed,
  }
  try {
    await this.ensurePeerConnected({ pubkey, host })
  } catch (e) {
    const error = new Error(e.message)
    error.payload = { ...req, node_pubkey: pubkey }
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
  const parsePayload = payload => ({
    ...payload,
    node_pubkey: Buffer.from(payload.node_pubkey).toString('hex'),
  })
  return new Promise((resolve, reject) => {
    try {
      const call = this.service.openChannel(payload)

      call.on('data', data => {
        grpcLog.debug('OPEN_CHANNEL DATA', data)
        const response = { ...parsePayload(payload), data }
        this.emit('openChannel.data', response)
        resolve(response)
      })

      call.on('error', data => {
        grpcLog.error('OPEN_CHANNEL ERROR', data)
        const error = new Error(data.message)
        error.payload = parsePayload(payload)
        this.emit('openChannel.error', error)
        reject(error)
      })

      call.on('status', status => {
        grpcLog.debug('OPEN_CHANNEL STATUS', status)
        this.emit('openChannel.status', status)
      })

      call.on('end', () => {
        grpcLog.debug('OPEN_CHANNEL END')
        this.emit('openChannel.end')
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
        channel_point: { funding_txid, output_index },
        chan_id,
        force,
      } = payload
      const tx = funding_txid
        .match(/.{2}/g)
        .reverse()
        .join('')

      const req = {
        channel_point: {
          funding_txid_bytes: Buffer.from(tx, 'hex'),
          output_index: Number(output_index),
        },
        force,
      }
      const call = this.service.closeChannel(req)

      call.on('data', data => {
        grpcLog.debug('CLOSE_CHANNEL DATA', data)
        const response = { data, chan_id }
        this.emit('closeChannel.data', response)
        resolve(response)
      })

      call.on('error', data => {
        grpcLog.error('CLOSE_CHANNEL ERROR', data)
        const error = new Error(data.message)
        error.payload = { chan_id }
        this.emit('closeChannel.error', error)
        reject(error)
      })

      call.on('status', status => {
        grpcLog.debug('CLOSE_CHANNEL STATUS', status)
        this.emit('closeChannel.status', status)
      })

      call.on('end', () => {
        grpcLog.debug('CLOSE_CHANNEL END')
        this.emit('closeChannel.end')
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
 * @returns {Promise} SendResponse
 */
async function sendPayment(payload = {}) {
  return new Promise((resolve, reject) => {
    try {
      const call = this.service.sendPayment(payload)

      call.on('data', data => {
        const isSuccess = !data.payment_error
        if (isSuccess) {
          grpcLog.debug('PAYMENT SUCCESS', data)

          // Convert payment_hash to hex string.
          let paymentHash = data.payment_hash
          if (paymentHash) {
            paymentHash = paymentHash.toString('hex')
          }

          // In some cases lnd does not return the payment_hash. If this happens, retrieve it from the invoice.
          else {
            const invoice = bolt11DecodePayReq(payload.payment_request)
            const paymentHashTag = invoice.tags
              ? invoice.tags.find(t => t.tagName === 'payment_hash')
              : null
            paymentHash = paymentHashTag ? paymentHashTag.data : null
          }

          // Convert the preimage to a hex string.
          const paymentPreimage = data.payment_preimage
            ? data.payment_preimage.toString('hex')
            : null

          // Notify the client of a successful payment.
          const res = {
            ...payload,
            data,
            payment_preimage: paymentPreimage,
            payment_hash: paymentHash,
          }
          this.emit('sendPayment.data', res)
          resolve(res)
        } else {
          // Notify the client if there was a problem sending the payment
          grpcLog.error('PAYMENT ERROR', data)
          const error = new Error(data.payment_error)
          error.payload = payload
          this.emit('sendPayment.error', error)
          reject(error)
        }

        call.end()
      })

      call.on('status', status => {
        grpcLog.debug('PAYMENT STATUS', status)
        this.emit('sendPayment.status', status)
      })

      call.on('end', () => {
        grpcLog.debug('PAYMENT END')
        this.emit('sendPayment.end')
      })

      call.write(payload)
    } catch (e) {
      const error = new Error(e.message)
      error.payload = payload
      throw error
    }
  })
}

export default {
  getInfo,
  getBalance,
  getChannels,
  createInvoice,
  ensurePeerConnected,
  connectAndOpen,
  openChannel,
  closeChannel,
  sendPayment,
  estimateFee,
  hasMethod,
}
