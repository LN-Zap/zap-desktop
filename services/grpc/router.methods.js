import { grpcLog } from '@zap/utils/log'
import { logGrpcCmd } from './helpers'

// ------------------------------------
// Wrappers / Overrides
// ------------------------------------

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
  sendPayment,
}
