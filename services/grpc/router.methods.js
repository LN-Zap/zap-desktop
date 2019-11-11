import { randomBytes } from 'crypto'
import config from 'config'
import get from 'lodash/get'
import { grpcLog } from '@zap/utils/log'
import { logGrpcCmd } from './helpers'

const PAYMENT_PROBE_TIMEOUT = config.invoices.probeTimeout

// ------------------------------------
// Wrappers / Overrides
// ------------------------------------

/**
 * probePayment - Call lnd grpc sendPayment method with a fake payment hash in order to probe for a route.
 *
 * @param {object} options Options
 * @returns {Promise} The route route when state is SUCCEEDED
 */
async function probePayment(options) {
  logGrpcCmd('Router.probePayment', options)

  // Use a payload that has the payment hash set to some random bytes.
  // This will cause the payment to fail at the final destination.
  const payload = {
    ...options,
    payment_hash: new Uint8Array(randomBytes(32)),
    timeout_seconds: get(options, 'timeout_seconds', PAYMENT_PROBE_TIMEOUT),
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
 * @returns {Promise} Original payload augmented with lnd sendPayment response data
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
