import { decodeInvoice } from '../utils'

// LND Get Invoice
export default function invoice(payreq) {
  return new Promise((resolve, reject) => {
    try {
      resolve(decodeInvoice(payreq))
    } catch (error) {
      reject(error)
    }
  })
}
