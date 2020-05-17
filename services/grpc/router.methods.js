import config from 'config'
import defaults from 'lodash/defaults'
import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { grpcLog } from '@zap/utils/log'
import { generatePreimage } from '@zap/utils/crypto'
import { logGrpcCmd } from './helpers'

const PAYMENT_TIMEOUT = config.payments.timeout
const PAYMENT_FEE_LIMIT = config.payments.feeLimit
const PAYMENT_MAX_PARTS = config.payments.maxParts
const PAYMENT_PROBE_TIMEOUT = config.payments.probeTimeout
const PAYMENT_PROBE_FEE_LIMIT = config.payments.probeFeeLimit

export const KEYSEND_PREIMAGE_TYPE = '5482373484'

const defaultProbeOptions = {
  timeoutSeconds: PAYMENT_PROBE_TIMEOUT,
  feeLimitSat: PAYMENT_PROBE_FEE_LIMIT,
  allowSelfPayment: true,
}

const defaultPaymentOptions = {
  timeoutSeconds: PAYMENT_TIMEOUT,
  feeLimitSat: PAYMENT_FEE_LIMIT,
  allowSelfPayment: true,
}

// ------------------------------------
// Overrides
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
  const payload = defaults(omitBy(options, isNil), defaultProbeOptions)

  // Use a payload that has the payment hash set to some random bytes.
  // This will cause the payment to fail at the final destination.
  payload.paymentHash = new Uint8Array(generatePreimage())

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
    let route

    call.on('data', data => {
      grpcLog.debug('PROBE DATA :%o', data)

      switch (data.state) {
        case 'IN_FLIGHT':
          grpcLog.info('PROBE IN_FLIGHT...')
          break

        case 'FAILED_INCORRECT_PAYMENT_DETAILS':
          grpcLog.info('PROBE SUCCESS: %o', data)
          // Prior to lnd v0.10.0 sendPayment would return a single route under the `route` key.
          route = data.route || data.htlcs[0].route
          // FIXME: For some reason the customRecords key is corrupt in the grpc response object.
          // For now, assume that if a custom_record key is set that it is a keysend record and fix it accordingly.
          route.hops = route.hops.map(hop => {
            Object.keys(hop.customRecords).forEach(key => {
              hop.customRecords[KEYSEND_PREIMAGE_TYPE] = hop.customRecords[key]
              delete hop.customRecords[key]
            })
            return hop
          })
          result = route
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
      error = new Error(e.details || e.message)
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
  const payload = defaults(omitBy(options, isNil), defaultPaymentOptions)
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
      error = new Error(e.details || e.message)
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

/**
 * sendPaymentV2 - Call lnd grpc sendPaymentV2 method.
 *
 * @param {object} options Options
 * @returns {Promise} Original payload augmented with lnd sendPaymentV2 response data
 */
async function sendPaymentV2(options = {}) {
  const payload = defaults(omitBy(options, isNil), defaultPaymentOptions)
  logGrpcCmd('Router.sendPaymentV2', payload)

  // Our response will always include the original payload.
  const result = { ...payload }
  let error

  const decorateError = e => {
    e.details = result
    return e
  }

  return new Promise((resolve, reject) => {
    grpcLog.time('sendPaymentV2')
    const call = this.service.sendPaymentV2(payload)

    call.on('data', data => {
      grpcLog.debug('PAYMENT DATA :%o', data)

      switch (data.status) {
        case 'IN_FLIGHT':
          grpcLog.info('IN_FLIGHT...')
          break

        case 'SUCCEEDED':
          grpcLog.info('PAYMENT SUCCESS: %o', data)

          // Add lnd return data to the response.
          Object.assign(result, data)
          break

        default:
          grpcLog.warn('PAYMENT FAILED: %o', data)
          error = new Error(data.failureReason)
      }
    })

    call.on('status', status => {
      grpcLog.info('PAYMENT STATUS :%o', status)
    })

    call.on('error', e => {
      grpcLog.warn('PAYMENT ERROR :%o', e)
      error = new Error(e.details || e.message)
    })

    call.on('end', () => {
      grpcLog.timeEnd('sendPaymentV2')
      grpcLog.info('PAYMENT END')
      if (error) {
        return reject(decorateError(error))
      }
      if (!result.paymentPreimage) {
        return reject(decorateError(new Error('TERMINATED_EARLY')))
      }
      return resolve(result)
    })
  })
}

export default {
  probePayment,
  sendPayment,
  sendPaymentV2,
}
