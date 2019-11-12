import { randomBytes } from 'crypto'
import config from 'config'
import defaults from 'lodash/defaults'
import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { grpcLog } from '@zap/utils/log'
import { logGrpcCmd } from './helpers'

const PAYMENT_TIMEOUT = config.payments.timeout
const PAYMENT_FEE_LIMIT = config.payments.feeLimit

const PAYMENT_PROBE_TIMEOUT = config.payments.probeTimeout
const PAYMENT_PROBE_FEE_LIMIT = config.payments.probeFeeLimit

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
  // Use a payload that has the payment hash set to some random bytes.
  // This will cause the payment to fail at the final destination.
  const payload = defaults(omitBy(options, isNil), {
    payment_hash: new Uint8Array(randomBytes(32)),
    timeout_seconds: PAYMENT_PROBE_TIMEOUT,
    fee_limit_sat: PAYMENT_PROBE_FEE_LIMIT,
  })

  logGrpcCmd('Router.probePayment', payload)

  let result
  let error

  const decorateError = e => {
    e.details = result
    return e
  }

  return new Promise((resolve, reject) => {
    grpcLog.time('probePayment')
    const call = this.service.sendPayment(payload)

    call.on('data', data => {
      grpcLog.debug('PROBE DATA :%o', data)

      switch (data.state) {
        case 'IN_FLIGHT':
          grpcLog.info('PROBE IN_FLIGHT...')
          break

        case 'FAILED_INCORRECT_PAYMENT_DETAILS':
          grpcLog.info('PROBE SUCCESS: %o', data)
          result = data.route
          break

        default:
          grpcLog.warn('PROBE FAILED: %o', data)
          error = new Error(data.state)
      }
    })

    call.on('status', status => {
      grpcLog.info('PROBE STATUS :%o', status)
    })

    call.on('error', e => {
      grpcLog.warn('PROBE ERROR :%o', e)
      error = e
    })

    call.on('end', () => {
      grpcLog.timeEnd('probePayment')
      grpcLog.info('PROBE END')
      if (error) {
        return reject(decorateError(error))
      }
      if (!result) {
        return reject(decorateError(new Error('TERMINATED_EARLY')))
      }
      return resolve(result)
    })
  })
}

/**
 * sendPayment - Call lnd grpc sendPayment method.
 *
 * @param {object} options Options
 * @returns {Promise} Original payload augmented with lnd sendPayment response data
 */
async function sendPayment(options = {}) {
  // Use a payload that has the payment hash set to some random bytes.
  // This will cause the payment to fail at the final destination.
  const payload = defaults(omitBy(options, isNil), {
    timeout_seconds: PAYMENT_TIMEOUT,
    fee_limit: PAYMENT_FEE_LIMIT,
  })

  logGrpcCmd('Router.sendPayment', payload)

  // Our response will always include the original payload.
  const result = { ...payload }
  let error

  const decorateError = e => {
    e.details = result
    return e
  }

  return new Promise((resolve, reject) => {
    grpcLog.time('sendPayment')
    const call = this.service.sendPayment(payload)

    call.on('data', data => {
      grpcLog.debug('PAYMENT DATA :%o', data)

      switch (data.state) {
        case 'IN_FLIGHT':
          grpcLog.info('IN_FLIGHT...')
          break

        case 'SUCCEEDED':
          grpcLog.info('PAYMENT SUCCESS: %o', data)

          // Convert the preimage to a hex string.
          data.preimage = data.preimage && data.preimage.toString('hex')

          // Add lnd return data, as well as payment preimage and hash as hex strings to the response.
          Object.assign(result, data)
          break

        default:
          grpcLog.warn('PAYMENT FAILED: %o', data)
          error = new Error(data.state)
      }
    })

    call.on('status', status => {
      grpcLog.info('PAYMENT STATUS :%o', status)
    })

    call.on('error', e => {
      grpcLog.warn('PAYMENT ERROR :%o', e)
      error = e
    })

    call.on('end', () => {
      grpcLog.timeEnd('sendPayment')
      grpcLog.info('PAYMENT END')
      if (error) {
        return reject(decorateError(error))
      }
      if (!result.preimage) {
        return reject(decorateError(new Error('TERMINATED_EARLY')))
      }
      return resolve(result)
    })
  })
}

export default {
  probePayment,
  sendPayment,
}
