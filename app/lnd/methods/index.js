/* eslint no-console: 0 */ // --> OFF
// import grpc from 'grpc'

import * as invoicesController from './invoicesController'
import * as channelController from './channelController'
import * as walletController from './walletController'
import * as peersController from './peersController'
import * as paymentsController from './paymentsController'
import * as networkController from './networkController'

// TODO - GetChanInfo
// TODO - GetTransactions
// TODO - GetNodeInfo
// TODO - DescribeGraph
// TODO - GetNetworkInfo
// TODO - QueryRoutes
// TODO - DecodePayReq
// TODO - SendPayment
// TODO - DeleteAllPayments

export default function (lnd, event, msg, data) {
  switch (msg) {
    case 'info':
      networkController
        .getInfo(lnd)
        .then((infoData) => {
          event.sender.send('receiveInfo', infoData)
          event.sender.send('receiveCryptocurrency', infoData.chains[0])
          return infoData
        })
        .catch(() => event.sender.send('infoFailed'))
      break
    case 'describeNetwork':
      networkController
        .describeGraph(lnd)
        .then(networkData => event.sender.send('receiveDescribeNetwork', networkData))
        .catch(error => console.log('describeGraph error: ', error))
      break
    case 'queryRoutes':
      // Data looks like { pubkey: String, amount: Number }
      networkController
        .queryRoutes(lnd, data)
        .then(routes => event.sender.send('receiveQueryRoutes', routes))
        .catch(error => console.log('queryRoutes error: ', error))
      break
    case 'getInvoiceAndQueryRoutes':
      // Data looks like { pubkey: String, amount: Number }
      invoicesController
        .getInvoice(lnd, { pay_req: data.payreq })
        .then(invoiceData =>
          networkController.queryRoutes(lnd, {
            pubkey: invoiceData.destination,
            amount: invoiceData.num_satoshis
          }))
        .then(routes => event.sender.send('receiveInvoiceAndQueryRoutes', routes))
        .catch(error => console.log('getInvoiceAndQueryRoutes invoice error: ', error))
      break
    case 'newaddress':
      // Data looks like { address: '' }
      walletController
        .newAddress(lnd, data.type)
        .then(({ address }) => event.sender.send('receiveAddress', address))
        .catch(error => console.log('newaddress error: ', error))
      break
    case 'setAlias':
      // Data looks like { new_alias: '' }
      walletController
        .setAlias(lnd, data)
        .then(() => event.sender.send('aliasSet'))
        .catch(error => console.log('setAlias error: ', error))
      break
    case 'peers':
      // Data looks like { peers: [] }
      peersController
        .listPeers(lnd)
        .then(peersData => event.sender.send('receivePeers', peersData))
        .catch(error => console.log('peers error: ', error))
      break
    case 'channels':
      // Data looks like
      // [ { channels: [] }, { total_limbo_balance: 0, pending_open_channels: [], pending_closing_channels: [], pending_force_closing_channels: [] } ]
      Promise.all([channelController.listChannels, channelController.pendingChannels].map(func => func(lnd)))
        .then(channelsData => event.sender.send('receiveChannels', { channels: channelsData[0].channels, pendingChannels: channelsData[1] }))
        .catch(error => console.log('channels error: ', error))
      break
    case 'transactions':
      // Data looks like { transactions: [] }
      walletController
        .getTransactions(lnd)
        .then(transactionsData => event.sender.send('receiveTransactions', transactionsData))
        .catch(error => console.log('transactions error: ', error))
      break
    case 'payments':
      // Data looks like { payments: [] }
      paymentsController
        .listPayments(lnd)
        .then(paymentsData => event.sender.send('receivePayments', paymentsData))
        .catch(error => console.log('payments error: ', error))
      break
    case 'invoices':
      // Data looks like { invoices: [] }
      invoicesController
        .listInvoices(lnd)
        .then(invoicesData => event.sender.send('receiveInvoices', invoicesData))
        .catch(error => console.log('invoices error: ', error))
      break
    case 'invoice':
      // Data looks like { invoices: [] }
      invoicesController
        .getInvoice(lnd, { pay_req: data.payreq })
        .then(invoiceData => event.sender.send('receiveInvoice', invoiceData))
        .catch(error => console.log('invoice error: ', error))
      break
    case 'balance':
      // Balance looks like [ { balance: '129477456' }, { balance: '243914' } ]
      Promise.all([walletController.walletBalance, channelController.channelBalance].map(func => func(lnd)))
        .then((balance) => {
          event.sender.send('receiveBalance', { walletBalance: balance[0].total_balance, channelBalance: balance[1].balance })
          return balance
        })
        .catch(error => console.log('balance error: ', error))
      break
    case 'createInvoice':
      // Invoice looks like { r_hash: Buffer, payment_request: '' }
      // { memo, value } = data
      invoicesController
        .addInvoice(lnd, data)
        .then(newinvoice =>
          invoicesController
            .getInvoice(lnd, { pay_req: newinvoice.payment_request })
            .then(decodedInvoice => {
              event.sender.send(
                'createdInvoice',
                Object.assign(decodedInvoice, {
                  memo: data.memo,
                  value: data.value,
                  r_hash: Buffer.from(newinvoice.r_hash, 'hex').toString('hex'),
                  payment_request: newinvoice.payment_request,
                  creation_date: Date.now() / 1000
                })
              )
            })
            .catch(error => {
              console.log('decodedInvoice error: ', error)
              event.sender.send('invoiceFailed', { error: error.toString() })
            })
        )
        .catch((error) => {
          console.log('addInvoice error: ', error)
          event.sender.send('invoiceFailed', { error: error.toString() })
        })
      break
    case 'sendPayment':
      // Payment looks like { payment_preimage: Buffer, payment_route: Object }
      // { paymentRequest } = data
      paymentsController
        .sendPaymentSync(lnd, data)
        .then((payment) => {
          const { payment_route } = payment
          console.log('payinvoice success: ', payment_route)
          event.sender.send('paymentSuccessful', Object.assign(data, { payment_route }))
          return payment
        })
        .catch(({ error }) => {
          console.log('error: ', error)
          event.sender.send('paymentFailed', { error: error.toString() })
        })
      break
    case 'sendCoins':
      // Transaction looks like { txid: String }
      // { amount, addr } = data
      walletController
        .sendCoins(lnd, data)
        .then(({ txid }) => event.sender.send('transactionSuccessful', { amount: data.amount, addr: data.addr, txid }))
        .catch((error) => {
          console.log('error: ', error)
          event.sender.send('transactionError', { error: error.toString() })
        })
      break
    case 'openChannel':
      // Response is empty. Streaming updates on channel status and updates
      // { pubkey, localamt, pushamt } = data
      channelController
        .openChannel(lnd, event, data)
        .then((channel) => {
          console.log('CHANNEL: ', channel)
          event.sender.send('channelSuccessful', { channel })
          return channel
        })
        .catch(error => console.log('openChannel error: ', error))
      break
    case 'closeChannel':
      // Response is empty. Streaming updates on channel status and updates
      // { channel_point, force } = data
      channelController
        .closeChannel(lnd, event, data)
        .then((result) => {
          console.log('CLOSE CHANNEL: ', result)
          event.sender.send('closeChannelSuccessful')
          return result
        })
        .catch(error => console.log('closeChannel error: ', error))
      break
    case 'connectPeer':
      // Returns a peer_id. Pass the pubkey, host and peer_id so we can add a new peer to the list
      // { pubkey, host } = data
      peersController
        .connectPeer(lnd, data)
        .then((peer) => {
          const { peer_id } = peer
          console.log('peer_id: ', peer_id)
          event.sender.send('connectSuccess', { pub_key: data.pubkey, address: data.host, peer_id })
          return peer
        })
        .catch((error) => {
          event.sender.send('connectFailure', { error: error.toString() })
          console.log('connectPeer error: ', error)
        })
      break
    case 'disconnectPeer':
      // Empty response. Pass back pubkey on success to remove it from the peers list
      // { pubkey } = data
      peersController
        .disconnectPeer(lnd, data)
        .then(() => {
          console.log('pubkey: ', data.pubkey)
          event.sender.send('disconnectSuccess', { pubkey: data.pubkey })
          return null
        })
        .catch(error => console.log('disconnectPeer error: ', error))
      break
    case 'connectAndOpen':
      // Connects to a peer if we aren't connected already and then attempt to open a channel
      // {} = data
      channelController
        .connectAndOpen(lnd, event, data)
        .then((channelData) => {
          console.log('connectAndOpen data: ', channelData)
          // event.sender.send('connectSuccess', { pub_key: data.pubkey, address: data.host, peer_id })
          return channelData
        })
        .catch((error) => {
          // event.sender.send('connectFailure', { error: error.toString() })
          console.log('connectAndOpen error: ', error)
        })
      break
    default:
  }
}
