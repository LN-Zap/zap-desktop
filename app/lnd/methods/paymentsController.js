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
