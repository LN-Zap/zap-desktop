/**
 * Dispatches a bi-directional streaming RPC for sending payments through the Lightning Network.
 * @param  {[type]} lnd            [description]
 * @param  {[type]} paymentRequest [description]
 * @return {[type]}                [description]
 */
export function sendPaymentSync(lnd, { paymentRequest }) {
  return new Promise((resolve, reject) => {
    lnd.sendPaymentSync({ payment_request: paymentRequest }, (err, data) => {
      if (err) { reject(err) }

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
export function sendPayment(lnd, { paymentRequest }) {
  return new Promise((resolve, reject) => {
    lnd.sendPayment({ payment_request: paymentRequest }, (err, data) => {
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
export function decodePayReq(lnd, { payReq }) {
  return new Promise((resolve, reject) => {
    lnd.decodePayReq({ pay_req: payReq }, (err, data) => {
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
export function listPayments(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listPayments({}, (err, data) => {
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
export function deleteAllPayments(lnd) {
  return new Promise((resolve, reject) => {
    lnd.deleteAllPayments({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
