/**
 * Dispatches a bi-directional streaming RPC for sending payments through the Lightning Network.
 * @param  {[type]} lnd            [description]
 * @param  {[type]} paymentRequest [description]
 * @return {[type]}                [description]
 */
export function sendPaymentSync(lnd, meta, { paymentRequest }) {
  return new Promise((resolve, reject) => {
    lnd.sendPaymentSync({ payment_request: paymentRequest }, meta, (error, data) => {
      if (error) {
        reject({ error }) // eslint-disable-line
        return
      }

      if (!data || !data.payment_route) { reject({ error: data.payment_error }) } // eslint-disable-line

      resolve(data)
    })
  })
}


/**
 * Synchronous non-streaming version of SendPayment
 * @param  {[type]} lnd            [description]
 * @param  {[type]} paymentRequest [description]
 * @return {[type]}                [description]
 */
export function sendPayment(lnd, meta, { paymentRequest }) {
  return new Promise((resolve, reject) => {
    lnd.sendPayment({ payment_request: paymentRequest }, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * Returns a full description of the conditions encoded within the payment request
 * @param  {[type]} lnd    [description]
 * @param  {[type]} payReq [description]
 * @return {[type]}        [description]
 */
export function decodePayReq(lnd, meta, { payReq }) {
  return new Promise((resolve, reject) => {
    lnd.decodePayReq({ pay_req: payReq }, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * Returns a list of all outgoing payments
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listPayments(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.listPayments({}, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * Deletes all outgoing payments from DB.
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function deleteAllPayments(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.deleteAllPayments({}, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
