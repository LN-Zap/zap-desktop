import promiseTimeout from '../../utils/promiseTimeout'

const PAYMENT_TIMEOUT = 60 * 1000

/**
 * Dispatches a bi-directional streaming RPC for sending payments through the Lightning Network.
 * @param  {[type]} lnd     [description]
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function sendPayment(lnd, { paymentRequest, amt, feeLimit }) {
  return new Promise((resolve, reject) => {
    const request = {
      payment_request: paymentRequest,
      amt,
      fee_limit: { fixed: feeLimit }
    }
    const call = lnd.sendPayment({})
    call.on('data', resolve)
    call.on('error', reject)
    call.write(request)
  })
}

/**
 * Synchronous non-streaming version of SendPayment
 * @param  {[type]} lnd     [description]
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function sendPaymentSync(lnd, { paymentRequest, amt, feeLimit }) {
  const doSendPaymentSync = function() {
    return new Promise((resolve, reject) => {
      const request = {
        payment_request: paymentRequest,
        amt,
        fee_limit: { fixed: feeLimit }
      }
      lnd.sendPaymentSync(request, (err, data) => {
        if (err) {
          return reject(err)
        } else if (data && data.payment_error) {
          return reject(data.payment_error)
        } else if (data && !data.payment_route) {
          return reject('No payment route')
        } else if (data && !data.payment_preimage) {
          return reject('No payment preimage')
        }
        resolve(data)
      })
    })
  }

  // Lnd timees the payment out after 60 seconds.
  // Reject this promise if we don't get a response from lnd in time.
  return promiseTimeout(PAYMENT_TIMEOUT, doSendPaymentSync())
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
