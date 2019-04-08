import promisifiedCall from '@zap/utils/promisifiedCall'
import { mainLog } from '@zap/utils/log'
import { decodePayReq as bolt11DecodePayReq } from '@zap/utils/crypto'

/**
 * [getInfo description]
 * @return {[type]} [description]
 */
async function getInfo() {
  const infoData = await promisifiedCall(this.service, this.service.getInfo)

  // Add semver info into info so that we can use it to customise functionality based on active version.
  infoData.semver = this.version

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
 * [newAddress description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function newAddress(payload = {}) {
  return promisifiedCall(this.service, this.service.newAddress, payload)
}

/**
 * [walletBalance description]
 * @return {Promise} [description]
 */
async function walletBalance() {
  return promisifiedCall(this.service, this.service.walletBalance, {})
}

/**
 * [channelBalance description]
 * @return {Promise} [description]
 */
async function channelBalance() {
  return promisifiedCall(this.service, this.service.channelBalance, {})
}

/**
 * [getBalance description]
 * @return {Promise} [description]
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
 * [listPayments description]
 * @return {Promise} [description]
 */
async function listPayments() {
  return promisifiedCall(this.service, this.service.listPayments, {})
}

/**
 * [listInvoices description]
 * @return {Promise} [description]
 */
async function listInvoices() {
  return promisifiedCall(this.service, this.service.listInvoices, {})
}

/**
 * [getTransactions description]
 * @return {Promise} [description]
 */
async function getTransactions() {
  return promisifiedCall(this.service, this.service.getTransactions, {})
}

/**
 * [listPeers description]
 * @return {Promise} [description]
 */
async function listPeers() {
  return promisifiedCall(this.service, this.service.listPeers, {})
}

/**
 * [listChannels description]
 * @return {Promise} [description]
 */
async function listChannels() {
  const data = await promisifiedCall(this.service, this.service.listChannels, {})
  return data.channels
}

/**
 * [pendingChannels description]
 * @return {Promise} [description]
 */
async function pendingChannels() {
  return promisifiedCall(this.service, this.service.pendingChannels, {})
}

/**
 * [closedChannels description]
 * @return {Promise} [description]
 */
async function closedChannels() {
  const data = await promisifiedCall(this.service, this.service.closedChannels, {})
  return data.channels
}

/**
 * [getChannels description]
 * @return {Promise} [description]
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
 * [describeGraph description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function describeGraph(payload = {}) {
  return promisifiedCall(this.service, this.service.describeGraph, payload)
}

/**
 * [decodePayReq description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function decodePayReq(payload = {}) {
  return promisifiedCall(this.service, this.service.decodePayReq, payload)
}

/**
 * [lookupInvoice description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function lookupInvoice(payload = {}) {
  return promisifiedCall(this.service, this.service.lookupInvoice, payload)
}

/**
 * [addInvoice description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function addInvoice(payload = {}) {
  return promisifiedCall(this.service, this.service.addInvoice, payload)
}

/**
 * [createInvoice description]
 * @param  {[type]}  payload [description]
 * @return {Promise}         [description]
 */
async function reateInvoice(payload) {
  const invoice = await this.addInvoice(payload)
  const decodedInvoice = await this.decodePayReq({ pay_req: invoice.payment_request })

  return {
    ...decodedInvoice,
    memo: payload.memo,
    value: payload.value,
    r_hash: Buffer.from(invoice.r_hash, 'hex').toString('hex'),
    payment_request: invoice.payment_request,
    creation_date: Date.now() / 1000,
  }
}

/**
 * [queryRoutes description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function queryRoutes(payload = {}) {
  return promisifiedCall(this.service, this.service.queryRoutes, payload)
}

/**
 * [connectPeer description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function connectPeer(payload = {}) {
  return promisifiedCall(this.service, this.service.connectPeer, payload)
}

/**
 * [sendCoins description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function sendCoins(payload = {}) {
  return promisifiedCall(this.service, this.service.sendCoins, payload)
}

/**
 * [ensurePeerConnected description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
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
 * [connectAndOpen description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
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
 * [openChannel description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
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
        mainLog.info('OPEN_CHANNEL DATA', data)
        const response = { ...parsePayload(payload), data }
        this.emit('openChannel.data', response)
        resolve(response)
      })

      call.on('error', data => {
        mainLog.error('OPEN_CHANNEL ERROR', data)
        const error = new Error(data.message)
        error.payload = parsePayload(payload)
        this.emit('openChannel.error', error)
        reject(error)
      })

      call.on('status', status => {
        mainLog.info('OPEN_CHANNEL STATUS', status)
        this.emit('openChannel.status', status)
      })

      call.on('end', () => {
        mainLog.info('OPEN_CHANNEL END')
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
 * [closeChannel description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
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
        mainLog.info('CLOSE_CHANNEL DATA', data)
        const response = { data, chan_id }
        this.emit('closeChannel.data', response)
        resolve(response)
      })

      call.on('error', data => {
        mainLog.error('CLOSE_CHANNEL ERROR', data)
        const error = new Error(data.message)
        error.payload = { chan_id }
        this.emit('closeChannel.error', error)
        reject(error)
      })

      call.on('status', status => {
        mainLog.info('CLOSE_CHANNEL STATUS', status)
        this.emit('closeChannel.status', status)
      })

      call.on('end', () => {
        mainLog.info('CLOSE_CHANNEL END')
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
 * [sendPayment description]
 * @param  {Object}  [payload={}] [description]
 * @return {Promise}              [description]
 */
async function sendPayment(payload = {}) {
  return new Promise((resolve, reject) => {
    try {
      const call = this.service.sendPayment(payload)

      call.on('data', data => {
        const isSuccess = !data.payment_error
        if (isSuccess) {
          mainLog.info('PAYMENT SUCCESS', data)

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
          mainLog.error('PAYMENT ERROR', data)
          const error = new Error(data.payment_error)
          error.payload = payload
          this.emit('sendPayment.error', error)
          reject(error)
        }

        call.end()
      })

      call.on('status', status => {
        mainLog.info('PAYMENT STATUS', status)
        this.emit('sendPayment.status', status)
      })

      call.on('end', () => {
        mainLog.info('PAYMENT END')
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
  newAddress,
  walletBalance,
  channelBalance,
  getBalance,
  listPayments,
  listInvoices,
  getTransactions,
  listPeers,
  listChannels,
  pendingChannels,
  closedChannels,
  getChannels,
  describeGraph,
  decodePayReq,
  lookupInvoice,
  addInvoice,
  reateInvoice,
  queryRoutes,
  connectPeer,
  sendCoins,
  ensurePeerConnected,
  connectAndOpen,
  openChannel,
  closeChannel,
  sendPayment,
}
