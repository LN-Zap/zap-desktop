/* eslint no-console: 0 */ // --> OFF

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
      networkController.getInfo(lnd)
        .then((infoData) => {
          event.sender.send('receiveInfo', infoData)
          event.sender.send('receiveCryptocurrency', infoData.chains[0])
        })
        .catch(error => console.log('info error: ', error))
      break
    case 'newaddress':
    // Data looks like { address: '' }
      walletController.newAddress(lnd, data.type)
        .then(({ address }) => event.sender.send('receiveAddress', address))
        .catch(error => console.log('newaddress error: ', error))
      break
    case 'setAlias':
    // Data looks like { new_alias: '' }
      walletController.setAlias(lnd, data)
        .then(() => event.sender.send('aliasSet'))
        .catch(error => console.log('setAlias error: ', error))
      break
    case 'peers':
    // Data looks like { peers: [] }
      peersController.listPeers(lnd)
        .then(peersData => event.sender.send('receivePeers', peersData))
        .catch(error => console.log('peers error: ', error))
      break
    case 'channels':
    // Data looks like
    // [ { channels: [] }, { total_limbo_balance: 0, pending_open_channels: [], pending_closing_channels: [], pending_force_closing_channels: [] } ]
      Promise.all([channelController.listChannels, channelController.pendingChannels].map(func => func(lnd)))
        .then(channelsData =>
          event.sender.send('receiveChannels', { channels: channelsData[0].channels, pendingChannels: channelsData[1] })
        )
        .catch(error => console.log('channels error: ', error))
      break
    case 'transactions':
    // Data looks like { transactions: [] }
      walletController.getTransactions(lnd)
        .then(transactionsData => event.sender.send('receiveTransactions', transactionsData))
        .catch(error => console.log('transactions error: ', error))
      break
    case 'payments':
    // Data looks like { payments: [] }
      paymentsController.listPayments(lnd)
        .then(paymentsData => event.sender.send('receivePayments', paymentsData))
        .catch(error => console.log('payments error: ', error))
      break
    case 'invoices':
    // Data looks like { invoices: [] }
      invoicesController.listInvoices(lnd)
        .then(invoicesData => event.sender.send('receiveInvoices', invoicesData))
        .catch(error => console.log('invoices error: ', error))
      break
    case 'invoice':
    // Data looks like { invoices: [] }
      invoicesController.getInvoice(data.payreq)
        .then(invoiceData => event.sender.send('receiveInvoice', invoiceData))
        .catch(error => console.log('invoice error: ', error))
      break
    case 'balance':
    // Balance looks like [ { balance: '129477456' }, { balance: '243914' } ]
      Promise.all([walletController.walletBalance, channelController.channelBalance].map(func => func(lnd)))
        .then(balance => event.sender.send('receiveBalance', { walletBalance: balance[0].balance, channelBalance: balance[1].balance }))
        .catch(error => console.log('balance error: ', error))
      break
    case 'createInvoice':
    // Invoice looks like { r_hash: Buffer, payment_request: '' }
    // { memo, value } = data
      invoicesController.addInvoice(lnd, data)
        .then(newinvoice =>
          event.sender.send(
            'createdInvoice',
            Object.assign(newinvoice, {
              memo: data.memo,
              value: data.value,
              r_hash: new Buffer(newinvoice.r_hash, 'hex').toString('hex'),
              creation_date: Date.now() / 1000
            })
          )
        )
        .catch(error => console.log('addInvoice error: ', error))
      break
    case 'sendPayment':
    // Payment looks like { payment_preimage: Buffer, payment_route: Object }
    // { paymentRequest } = data
      paymentsController.sendPaymentSync(lnd, data)
        .then(({ payment_route }) => event.sender.send('paymentSuccessful', Object.assign(data, { payment_route })))
        .catch(error => console.log('payinvoice error: ', error))
      break
    case 'sendCoins':
    // Transaction looks like { txid: String }
    // { amount, addr } = data
      walletController.sendCoins(lnd, data)
        .then(({ txid }) => event.sender.send('transactionSuccessful', { amount: data.amount, addr: data.addr, txid }))
        .catch(error => event.sender.send('transactionError', { error }))
      break
    case 'openChannel':
    // Response is empty. Streaming updates on channel status and updates
    // { pubkey, localamt, pushamt } = data
      channelController.openChannel(lnd, event, data)
        .then((channel) => {
          console.log('CHANNEL: ', channel)
          event.sender.send('channelSuccessful', { channel })
        })
        .catch(error => console.log('openChannel error: ', error))
      break
    case 'closeChannel':
    // Response is empty. Streaming updates on channel status and updates
    // { channel_point, force } = data
      channelController.closeChannel(lnd, event, data)
        .then((result) => {
          console.log('CLOSE CHANNEL: ', result)
          event.sender.send('closeChannelSuccessful')
        })
        .catch(error => console.log('closeChannel error: ', error))
      break
    case 'connectPeer':
    // Returns a peer_id. Pass the pubkey, host and peer_id so we can add a new peer to the list
    // { pubkey, host } = data
      peersController.connectPeer(lnd, data)
        .then(({ peer_id }) => {
          console.log('peer_id: ', peer_id)
          event.sender.send('connectSuccess', { pub_key: data.pubkey, address: data.host, peer_id })
        })
        .catch(error => console.log('connectPeer error: ', error))
      break
    case 'disconnectPeer':
    // Empty response. Pass back pubkey on success to remove it from the peers list
    // { pubkey } = data
      peersController.disconnectPeer(lnd, data)
        .then(() => {
          console.log('pubkey: ', data.pubkey)
          event.sender.send('disconnectSuccess', { pubkey: data.pubkey })
        })
        .catch(error => console.log('disconnectPeer error: ', error))
      break
    default:
  }
}
