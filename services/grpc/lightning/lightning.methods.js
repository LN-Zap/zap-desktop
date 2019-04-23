import promisifiedCall from '@zap/utils/promisifiedCall'
import { grpcLog } from '@zap/utils/log'
import { decodePayReq as bolt11DecodePayReq } from '@zap/utils/crypto'

/**
 * Call lnd grpc getInfo method
 * @return {Promise<GetInfoResponse}
 */
async function getInfo() {
  const infoData = await promisifiedCall(this.service, this.service.getInfo, {})

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
 * Call lnd grpc newAddress method
 * @param  {Object}  payload rpc payload
 * @return {Promise<NewAddressResponse}
 */
async function newAddress(payload = {}) {
  return promisifiedCall(this.service, this.service.newAddress, payload)
}

/**
 * Call lnd grpc walletBalance method
 * @return {Promise<WalletBalanceResponse}
 */
async function walletBalance() {
  return promisifiedCall(this.service, this.service.walletBalance, {})
}

/**
 * Call lnd grpc channelBalance method
 * @return {Promise<ChannelBalanceResponse}
 */
async function channelBalance() {
  return promisifiedCall(this.service, this.service.channelBalance, {})
}

/**
 * Call lnd grpc walletBalance and channelBalance method and combine result.
 * @return {Promise<Object>}
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
 * Call lnd grpc listPayments method
 * @return {Promise<ListPaymentsResponse>}
 */
async function listPayments() {
  return promisifiedCall(this.service, this.service.listPayments, {})
}

/**
 * Call lnd grpc listInvoices method
 * @return {Promise<ListInvoiceResponse>}
 */
async function listInvoices() {
  return promisifiedCall(this.service, this.service.listInvoices, {})
}

/**
 * Call lnd grpc getTransactions method
 * @return {Promise<TransactionDetails>}
 */
async function getTransactions() {
  return promisifiedCall(this.service, this.service.getTransactions, {})
}

/**
 * Call lnd grpc listPeers method
 * @return {Promise<ListPeersResponse>}
 */
async function listPeers() {
  return promisifiedCall(this.service, this.service.listPeers, {})
}

/**
 * Call lnd grpc listChannels method and extract channels data.
 * @return {Promise<[Channels]>}
 */
async function listChannels() {
  const data = await promisifiedCall(this.service, this.service.listChannels, {})
  return data.channels
}

/**
 * Call lnd grpc pendingChannels method
 * @return {Promise<PendingChannelsResponse>}
 */
async function pendingChannels() {
  return promisifiedCall(this.service, this.service.pendingChannels, {})
}

/**
 * Call lnd grpc closedChannels method and extract channels data.
 * @return {Promise<[Channels]>}
 */
async function closedChannels() {
  const data = await promisifiedCall(this.service, this.service.closedChannels, {})
  return data.channels
}

/**
 * Call lnd grpc listChannels, pendingChannels and closedChannels method and combine result.
 * @return {Promise<Object>}
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
 * Call lnd grpc describeGraph method
 * @param  {Object}  payload rpc payload
 * @return {Promise<ChannelGraph>}
 */
async function describeGraph(payload = {}) {
  return promisifiedCall(this.service, this.service.describeGraph, payload)
}

/**
 * Call lnd grpc decodePayReq method
 * @param  {Object}  payload rpc payload
 * @return {Promise<PayReq>}
 */
async function decodePayReq(payload = {}) {
  return promisifiedCall(this.service, this.service.decodePayReq, payload)
}

/**
 * Call lnd grpc lookupInvoice method
 * @param  {Object}  payload rpc payload
 * @return {Promise<Invoice>}
 */
async function lookupInvoice(payload = {}) {
  return promisifiedCall(this.service, this.service.lookupInvoice, payload)
}

/**
 * Call lnd grpc addInvoice method
 * @param  {Object}  payload rpc payload
 * @return {Promise<AddInvoiceResponse>}
 */
async function addInvoice(payload = {}) {
  return promisifiedCall(this.service, this.service.addInvoice, payload)
}

/**
 * Call lnd grpc createInvoice method
 * @param  {[type]}  payload [description]
 * @return {Promise<Object>}
 */
async function createInvoice(payload) {
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
 * Call lnd grpc queryRoutes method
 * @param  {Object}  payload rpc payload
 * @return {Promise<QueryRoutesResponse>}
 */
async function queryRoutes(payload = {}) {
  return promisifiedCall(this.service, this.service.queryRoutes, payload)
}

/**
 * Call lnd grpc connectPeer method
 * @param  {Object}  payload rpc payload
 * @return {Promise<ConnectPeerResponse>}
 */
async function connectPeer(payload = {}) {
  return promisifiedCall(this.service, this.service.connectPeer, payload)
}

/**
 * Call lnd grpc sendCoins method
 * @param  {Object}  payload rpc payload
 * @return {Promise<SendCoinsResponse>}
 */
async function sendCoins(payload = {}) {
  return promisifiedCall(this.service, this.service.sendCoins, payload)
}

/**
 * Call lnd grpc connectPeer method if not already connected to the peer
 * @param  {Object}  payload rpc payload
 * @return {Promise<ConnectPeerResponse|Peer>}
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
 * Estimates on-chain fee
 *
 * @param {string} address
 * @param {number} amount amount in satoshis
 * @param {number} targetConf desired confirmation time
 * @returns {Promise<EstimateFeeResponse>} {fee_sat, feerate_sat_per_byte}
 */
async function estimateFee(address, amount, targetConf) {
  const payload = { AddrToAmount: { [address]: amount }, target_conf: targetConf }
  return promisifiedCall(this.service, this.service.estimateFee, payload)
}

/**
 * Connect to peer and open a channel.
 * @param  {Object}  payload rpc payload
 * @return {Promise<Object>}
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
 * Call lnd grpc openChannel method
 * @param  {Object}  payload rpc payload
 * @return {Promise<Object>}
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
        grpcLog.info('OPEN_CHANNEL DATA', data)
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
        grpcLog.info('OPEN_CHANNEL STATUS', status)
        this.emit('openChannel.status', status)
      })

      call.on('end', () => {
        grpcLog.info('OPEN_CHANNEL END')
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
 * Call lnd grpc closeChannel method
 * @param  {Object}  payload rpc payload
 * @return {Promise<Object>}
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
        grpcLog.info('CLOSE_CHANNEL DATA', data)
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
        grpcLog.info('CLOSE_CHANNEL STATUS', status)
        this.emit('closeChannel.status', status)
      })

      call.on('end', () => {
        grpcLog.info('CLOSE_CHANNEL END')
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
 * Call lnd grpc sendPayment method
 * @param  {Object}  payload rpc payload
 * @return {Promise<Object>}
 */
async function sendPayment(payload = {}) {
  return new Promise((resolve, reject) => {
    try {
      const call = this.service.sendPayment(payload)

      call.on('data', data => {
        const isSuccess = !data.payment_error
        if (isSuccess) {
          grpcLog.info('PAYMENT SUCCESS', data)

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
        grpcLog.info('PAYMENT STATUS', status)
        this.emit('sendPayment.status', status)
      })

      call.on('end', () => {
        grpcLog.info('PAYMENT END')
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
  createInvoice,
  queryRoutes,
  connectPeer,
  sendCoins,
  ensurePeerConnected,
  connectAndOpen,
  openChannel,
  closeChannel,
  sendPayment,
  estimateFee,
}
