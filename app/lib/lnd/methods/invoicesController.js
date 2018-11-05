import pushinvoices from '../push/subscribeinvoice'

/**
 * Attempts to add a new invoice to the invoice database.
 * @param  lnd   [description]
 * @param  memo  [description]
 * @param  value [description]
 * @return     [description]
 */
export function addInvoice(lnd, { memo, value, private: privateInvoice }) {
  return new Promise((resolve, reject) => {
    lnd.addInvoice({ memo, value, private: privateInvoice, expiry: 600 }, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Returns a list of all the invoices currently stored within the database
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listInvoices(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listInvoices({}, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * @param  {[type]} payreq [description]
 * @return {[type]}        [description]
 */
export function getInvoice(lnd, { pay_req }) {
  return new Promise((resolve, reject) => {
    lnd.decodePayReq({ pay_req }, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Attemps to look up an invoice according to its payment hash
 * @param  {[type]} lnd   [description]
 * @param  {[type]} rhash [description]
 * @return {[type]}       [description]
 */
export function lookupInvoice(lnd, { rhash }) {
  return new Promise((resolve, reject) => {
    lnd.lookupInvoice({ r_hash: rhash }, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Returns a uni-directional stream (server -> client) for notifying the client of newly added/settled invoices
 * @param  {[type]} lnd   [description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
export function subscribeInvoices(lnd, event) {
  return pushinvoices(lnd, event)
}
