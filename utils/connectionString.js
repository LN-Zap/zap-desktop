import decode from 'lndconnect/decode'
import parse from 'lndconnect/parse'
import get from 'lodash/get'

import isBase64url from '@zap/utils/isBase64url'

/**
 * isValidLndConnectUri - Check for a valid lndconnect uri.
 *
 * @param {string} value String to validate
 * @returns {boolean} Boolean indicating whether the string is a valid or not
 */
export function isValidLndConnectUri(value) {
  try {
    const { host } = decode(value)
    return Boolean(host)
  } catch (e) {
    return false
  }
}

/**
 * isValidBtcPayConfig - Check for a valid BtcPayServer connection string.
 *
 * @param {string} value String to validate
 * @returns {boolean} Boolean indicating whether the string is a valid or not
 */
export function isValidBtcPayConfig(value) {
  try {
    const config = JSON.parse(value)
    const allConfigs = get(config, 'configurations', [])
    const params = allConfigs.find(c => c.type === 'grpc' && c.cryptoCode === 'BTC') || {}
    const { host, port, macaroon } = params
    return Boolean(host && port && macaroon)
  } catch (e) {
    return false
  }
}

/**
 * isEmbeddedLndConnectURI - Checks if lndconnect uri contains raw cert or macaroon and not paths.
 *
 * @param {string} uri String to check
 * @returns {boolean} Boolean indicating whether the string is an embedded lndconnect uri
 */
export function isEmbeddedLndConnectURI(uri) {
  try {
    const { cert, macaroon } = parse(uri)
    return isBase64url(cert) || isBase64url(macaroon)
  } catch (e) {
    return true
  }
}
