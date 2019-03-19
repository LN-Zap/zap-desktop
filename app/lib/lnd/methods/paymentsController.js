import pushpayment from '../push/sendpayment'
import { promisifiedCall } from '../../utils'

/**
 * Dispatches a bi-directional streaming RPC for sending payments through the Lightning Network.
 * @param  {[type]} lnd     [description]
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function sendPayment(lnd, event, { paymentRequest, amt, feeLimit }) {
  const request = {
    payment_request: paymentRequest,
    amt,
    fee_limit: { fixed: feeLimit },
  }
  return pushpayment(lnd, event, request)
}

/**
 * Returns a full description of the conditions encoded within the payment request
 * @param  {[type]} lnd    [description]
 * @param  {[type]} payReq [description]
 * @return {[type]}        [description]
 */
export function decodePayReq(lnd, { payReq }) {
  return promisifiedCall(lnd, lnd.decodePayReq, { pay_req: payReq })
}

/**
 * Returns a list of all outgoing payments
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listPayments(lnd) {
  return promisifiedCall(lnd, lnd.listPayments, {})
}

/**
 * Deletes all outgoing payments from DB.
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function deleteAllPayments(lnd) {
  return promisifiedCall(lnd, lnd.deleteAllPayments, {})
}
