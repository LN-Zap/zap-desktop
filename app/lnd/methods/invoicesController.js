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


/**
 * [lookupInvoice description]
 * @param  {[type]} lnd   [description]
 * @param  {[type]} rhash [description]
 * @return {[type]}       [description]
 */
export function lookupInvoice(lnd, { rhash }) {
  return new Prommise ((resolve, reject) => {

    lnd.lookupInvoice({r_hash: rhash}, (err, data) => {
      if(err) { reject (err) }

      resolve(data)
    })
  })
}


/**
 * [subscribeInvoices description]
 * @param  {[type]} lnd   [description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
export function subscribeInvoices(lnd, event) {
  return new Promise((resolve, reject) => {

    pushinvoices(lnd, event)
    .then(data => resolve(data))
    .catch(error => reject(error))
  })
}
