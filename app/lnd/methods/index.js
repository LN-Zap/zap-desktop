import allchannels from './allchannels'
import channelbalance from './channelbalance'
import channels from './channels'
import connectpeer from './connectpeer'
import createinvoice from './createinvoice'
import disconnectpeer from './disconnectpeer'
import info from './info'
import invoice from './invoice'
import invoices from './invoices'
import openchannel from './openchannel'
import payinvoice from './payinvoice'
import payments from './payments'
import peers from './peers'
import pendingchannels from './pendingchannels'
import walletbalance from './walletbalance'

export default function(lnd, event, msg, data) {
  switch(msg) {
    case 'info':
    info(lnd)
    .then(info =>event.sender.send('receiveInfo', info))
    .catch(error => console.log('info error: ', error))
    break
  case 'peers':
    // Data looks like { peers: [] }
    peers(lnd)
    .then(peers => event.sender.send('receivePeers', peers))
    .catch(error => console.log('peers error: ', error))
    break
  case 'channels':
    // Data looks like [ { channels: [channel, channel, channel] }, { total_limbo_balance: 0, pending_open_channels: [], pending_closing_channels: [], pending_force_closing_channels: [] } ]
    Promise.all([channels, pendingchannels].map(func => func(lnd)))
    .then(data => event.sender.send('receiveChannels', { channels: data[0].channels, pendingChannels: data[1] }))
    .catch(error => console.log('channels error: ', error))
    break
  case 'payments':
    // Data looks like { payments: [] }
    payments(lnd)
    .then(payments => event.sender.send('receivePayments', payments))
    .catch(error => console.log('payments error: ', error))
    break
  case 'invoices':
    // Data looks like { invoices: [] }
    invoices(lnd)
    .then(invoices => event.sender.send('receiveInvoices', invoices))
    .catch(error => console.log('invoices error: ', error))
    break
  case 'invoice':
    // Data looks like { invoices: [] }
    invoice(data.payreq)
    .then(invoice => event.sender.send('receiveInvoice', invoice))
    .catch(error => console.log('invoice error: ', error))
    break
  case 'balance':
    // Balance looks like [ { balance: '129477456' }, { balance: '243914' } ]
    Promise.all([walletbalance, channelbalance].map(func => func(lnd)))
    .then(balance => event.sender.send('receiveBalance', { walletBalance: balance[0].balance, channelBalance: balance[1].balance }))
    .catch(error => console.log('balance error: ', error))
    break
  case 'createInvoice':
    // Invoice looks like { r_hash: Buffer, payment_request: '' }
    // { memo, value } = data
    createInvoice(lnd, data)
    .then(invoice => event.sender.send('createdInvoice', Object.assign(invoice, { memo, value, r_hash: new Buffer(invoice.r_hash,'hex').toString('hex') })))
    .catch(error => console.log('createInvoice error: ', error))
    break
  case 'sendPayment':
    // Payment looks like { payment_preimage: Buffer, payment_route: Object }
    // { paymentRequest } = data
    sendPayment(lnd, data)
    .then(payment => event.sender.send('paymentSuccessful'))
    .catch(error => console.log('sendPayment error: ', error))
    break
  case 'openChannel':
    // Response is empty. Streaming updates on channel status and updates
    // { pubkey, localamt, pushamt } = data
    openchannel(lnd, event, data)
    .then(channel => {
      console.log('CHANNEL: ', channel)
      event.sender.send('channelSuccessful', { channel })
    })
    .catch(error => console.log('openChannel error: ', error))
    break
  case 'connectPeer':
    // Returns a peer_id. Pass the pubkey, host and peer_id so we can add a new peer to the list
    // { pubkey, host } = data
    connectpeer(lnd, data)
    .then(({ peer_id }) => {
      console.log('peer_id: ', peer_id)
      event.sender.send('connectSuccess', { pub_key: data.pubkey, address: data.host, peer_id })
    })
    .catch(error => console.log('connectPeer error: ', error))
    break
  case 'disconnectPeer':
    // Empty response. Pass back pubkey on success to remove it from the peers list
    // { pubkey } = data
    disconnectpeer(lnd, data)
    .then(() => {
      console.log('pubkey: ', data.pubkey)
      event.sender.send('disconnectSuccess', { pubkey: data.pubkey })
    })
    .catch(error => console.log('disconnectPeer error: ', error))
    break
  default:
    return
  }
}