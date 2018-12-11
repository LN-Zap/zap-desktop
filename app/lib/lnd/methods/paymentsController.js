/**
 * Dispatches a bi-directional streaming RPC for sending payments through the Lightning Network.
 * @param  {[type]} lnd            [description]
 * @param  {[type]} paymentRequest [description]
 * @return {[type]}                [description]
 */
export function sendPaymentSync(lnd, { paymentRequest, amt, feeLimit }) {
  return new Promise((resolve, reject) => {
    lnd.sendPaymentSync(
      { payment_request: paymentRequest, amt, fee_limit: { fixed: feeLimit } },
      (error, data) => {
        if (error) {
          return reject(error)
        } else if (!data || !data.payment_route) {
          return reject(data.payment_error)
        }
        resolve(data)
      }
    )
  })
}

/**
 * Synchronous non-streaming version of SendPayment
 * @param  {[type]} lnd            [description]
 * @param  {[type]} paymentRequest [description]
 * @return {[type]}                [description]
 */
export function sendPayment(lnd, { paymentRequest, amt, feeLimit }) {
  return new Promise((resolve, reject) => {
    lnd.sendPayment(
      { payment_request: paymentRequest, amt, fee_limit: { fixed: feeLimit } },
      (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(data)
      }
    )
  })
}

/**
 * Returns a full description of the conditions encoded within the payment request
 * @param  {[type]} lnd    [description]
 * @param  {[type]} payReq [description]
 * @return {[type]}        [description]
 */
export function decodePayReq(lnd, { payReq }) {
  return new Promise((resolve, reject) => {
    lnd.decodePayReq({ pay_req: payReq }, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Returns a list of all outgoing payments
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listPayments(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listPayments({}, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Deletes all outgoing payments from DB.
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function deleteAllPayments(lnd) {
  return new Promise((resolve, reject) => {
    lnd.deleteAllPayments({}, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}
