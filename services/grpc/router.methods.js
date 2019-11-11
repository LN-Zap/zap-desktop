import { grpcLog } from '@zap/utils/log'
import { logGrpcCmd } from './helpers'

const PAYMENT_PROBE_TIMEOUT = 15

// ------------------------------------
// Wrappers / Overrides
// ------------------------------------

/**
 * probePayment - Call lnd grpc sendPayment method with a fake payment hash in order to probe for a route.
 *
 * @param {string} dest Identity pubkey of the payment recipient
 * @param {number} amt Number of satoshis to send
 * @param {number} timeout Upper limit on the amount of time spent attempting to fulfill the payment
 * @returns {Promise} The taken route when state is SUCCEEDED.
 */
async function probePayment(dest, amt, timeout = PAYMENT_PROBE_TIMEOUT) {
  logGrpcCmd('Router.probePayment', { dest, amt, timeout })

  const payload = {
    payment_hash: Buffer.from('0'),
    dest: Buffer.from(dest, 'hex'),
    amt,
    timeout_seconds: timeout,
  }

  return new Promise((resolve, reject) => {
    const call = this.service.sendPayment(payload)

    call.on('data', data => {
      grpcLog.debug('PROBE DATA :%o', data)

      switch (data.state) {
        case 'IN_FLIGHT':
          // Payment is still in progress, do nothing.
          grpcLog.debug('PROBE IN_FLIGHT...')
          break

        case 'FAILED_INCORRECT_PAYMENT_DETAILS':
          grpcLog.info('PROBE SUCCESS: %o', data)
          resolve(data.route)
          break

        default:
          grpcLog.warn('PROBE FAILED: %o', data)
          reject(new Error(data.state))
      }
    })
  })
}

/**
 * sendPayment - Call lnd grpc sendPayment method.
 *
 * @param {object} payload Payload
 * @returns {Promise} Original payload augmented with lnd sendPayment response data.
 */
async function sendPayment(payload = {}) {
  logGrpcCmd('Router.sendPayment', payload)

  // Our response will always include the original payload.
  const res = { ...payload }

  const handleError = data => {
    const error = new Error(data.state)
    error.details = res
    return error
  }

  return new Promise((resolve, reject) => {
    const call = this.service.sendPayment(payload)

    call.on('data', data => {
      grpcLog.debug('PAYMENT DATA :%o', data)

      switch (data.state) {
        case 'IN_FLIGHT':
          // Payment is still in progress, do nothing.
          grpcLog.debug('IN_FLIGHT...')
          break

        case 'SUCCEEDED':
          grpcLog.info('PAYMENT SUCCESS: %o', data)

          // Convert the preimage to a hex string.
          data.preimage = data.preimage && data.preimage.toString('hex')

          // Add lnd return data, as well as payment preimage and hash as hex strings to the response.
          Object.assign(res, data)

          resolve(res)
          break

        default:
          grpcLog.warn('PAYMENT FAILED: %o', data)
          reject(handleError(data))
      }
    })
  })
}

export default {
  probePayment,
  sendPayment,
}
