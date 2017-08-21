import config from './config'
import lightning from './lib/lightning'
import { decodeInvoice } from './utils'

const lnd = lightning(config.lightningRpc, config.lightningHost)

// LND Get Info
export function info() {
  return new Promise((resolve, reject) => {
    lnd.getInfo({}, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}

// LND List Peers
export function peers() {
  return new Promise((resolve, reject) => {
    lnd.listPeers({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

// LND List Channels
const channels = new Promise((resolve, reject) => {
  lnd.listChannels({}, (err, data) => {
    if (err) { reject(err) }

    resolve(data)
  })
})

// LND List Pending Channels
const pendingChannels = new Promise((resolve, reject) => {
  lnd.pendingChannels({}, (err, data) => {
    if (err) { reject(err) }

    resolve(data)
  })
})

// LND Get All Channels
export function allChannels() {
  return Promise.all([channels, pendingChannels])
}

// LND Get Payments
export function payments() {
  return new Promise((resolve, reject) => {
    lnd.listPayments({}, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}

// LND Get Invoices
export function invoices() {
  return new Promise((resolve, reject) => {
    lnd.listInvoices({}, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}

// LND Get Invoice
export function invoice(payreq) {
  return new Promise((resolve, reject) => {
    resolve(decodeInvoice(payreq))
  })
}

// LND Get Wallet Balance
const walletBalance = new Promise((resolve, reject) => {
  lnd.walletBalance({}, (err, data) => {
    if (err) { reject(err) }

    resolve(data)
  })
})

// LND Get Channel Balance
const channelBalance = new Promise((resolve, reject) => {
  lnd.channelBalance({}, (err, data) => {
    if (err) { reject(err) }

    resolve(data)
  })
})

// LND Get Wallet + Channel Balance
export function balance() {
  return Promise.all([walletBalance, channelBalance])
}

// LND Get Wallet + Channel Balance
export function createInvoice({ memo, value }) {
  return new Promise((resolve, reject) => {
    lnd.addInvoice({ memo, value }, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}

export default {
  info,
  peers,
  allChannels,
  payments,
  invoices,
  invoice,
  balance,
  createInvoice
}
