import get from 'lodash/get'
import { grpcLog } from '@zap/utils/log'

export const KEYSEND_PREIMAGE_TYPE = '5482373484'

/**
 * logGrpcCmd - Logs a service method invocation.
 *
 * @param {string} method Name of method to log
 * @param {any} payload Payload of method to log
 */
export const logGrpcCmd = (method, payload) => {
  grpcLog.info(`Calling ${method} with payload: %o`, payload)
}

/**
 * getViableRoute - Finds a viable HTLC.
 *
 * @param {Array} htlcs Htlcs.
 * @returns {object} Selected htlc.
 */
export const getViableRoute = (htlcs = []) => {
  const htlc = htlcs.find(a =>
    ['INCORRECT_OR_UNKNOWN_PAYMENT_DETAILS', 'INVALID_ONION_HMAC'].includes(get(a, 'failure.code'))
  )
  return htlc && htlc.route
}

/**
 * formatRouteHops - Reformats route hops.
 *
 * For some reason the customRecords key is corrupt in the grpc response object.
 * For now, assume that if a custom_record key is set that it is a keysend record and fix it accordingly.
 *
 * @param {Array} hops Route opts to format.
 * @returns {Array} Reformated hops.
 */
export const formatRouteHops = (hops = []) => {
  return hops.map(hop => {
    Object.keys(hop.customRecords).forEach(key => {
      hop.customRecords[KEYSEND_PREIMAGE_TYPE] = hop.customRecords[key]
      delete hop.customRecords[key]
    })
    return hop
  })
}
