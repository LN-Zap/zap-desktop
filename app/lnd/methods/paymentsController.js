/**
 * [sendPaymentSync description]
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
 * [sendPayment description]
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
 * [decodePayReq description]
 * @param  {[type]} lnd    [description]
 * @param  {[type]} payReq [description]
 * @return {[type]}        [description]
 */
export function decodePayReq(lnd, { payReq }) {
  return new Promise((resolve, reject) => {

    lnd.decodePayReq({ pay_req: payReq}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * [listPayments description]
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


export function deleteAllPayments(lnd) {
  return new Promise((resolve, reject) => {

    lnd.deleteAllPayments({}, (err, data) => {
      if(err) { reject(err) }

      resolve(data)
    })
  })
}
