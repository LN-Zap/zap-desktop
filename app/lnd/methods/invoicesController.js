import { decodeInvoice } from '../utils'

/**
 * [createInvoice description]
 * @param  lnd   [description]
 * @param  memo  [description]
 * @param  value [description]
 * @return     [description]
 */
export function addInvoice (lnd, { memo, value }) {
  return new Promise((resolve, reject) => {

    lnd.addInvoice({ memo, value }, (err, data) => {
      if (err) { reject(err) }
      resolve(data)
    })
  })
}

/**
 * [listInvoices description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listInvoices(lnd) {
  return new Promise((resolve, reject) => {

    lnd.listInvoices({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * @param  {[type]} payreq [description]
 * @return {[type]}        [description]
 */
export function getInvoice(payreq) {
  return new Promise((resolve, reject) => {

    try {
      resolve(decodeInvoice(payreq))
    } catch (error) {
      reject(error)
    }

  })
}

//TODO - SubscribeInvoice
