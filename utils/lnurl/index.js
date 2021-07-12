import { decode } from 'querystring'
import { parse } from 'url'

import axios from 'axios'
import bech32 from 'bech32'

import { mainLog } from '@zap/utils/log'

export const LNURL_STATUS_ERROR = 'ERROR'
export const LNURL_STATUS_OK = 'OK'

/**
 * uintToString - Converts uint array to string.
 *
 * @param {Array} uintArray array
 * @returns {string} converted string
 */
function uintToString(uintArray) {
  const encodedString = String.fromCharCode.apply(null, uintArray)
  return decodeURIComponent(escape(encodedString))
}

/**
 * fetchLnurlParams - Fetches lnurl request params from the specified `lnurl`
 *
 * @param {string} lnurl url
 * @returns {object} request params
 * Throws exception if target `lnurl` is not a supported request type of params
 * weren't successfully fetched
 */
export async function fetchLnurlParams(lnurl) {
  mainLog.debug('Extracting params from lnurl: %s', lnurl)

  let params = {}

  const parsedUrl = parse(lnurl)
  const { query } = parsedUrl
  const decodedQueryString = decode(query)
  const { tag: urlTag } = decodedQueryString

  if (urlTag === 'login') {
    params = {
      tag: 'authRequest',
      k1: decodedQueryString.k1,
    }
  } else {
    const { data } = await axios.get(lnurl)
    params = data
  }

  mainLog.debug('Got params from lnurl: %o', params)

  const {
    // a second-level url which would accept a withdrawal Lightning invoice as query parameter
    callback,
    // an ephemeral secret which would allow user to withdraw funds
    k1: secret,
    maxWithdrawable,
    // A default withdrawal invoice description
    defaultDescription,
    // An optional field, defaults to 1 milisats if not present, can not be less than 1 or more than `maxWithdrawable`
    minWithdrawable,
    // Remote node address of form node_key@ip_address:port_number
    uri,
    // action type
    tag,
    // error status
    status,
    // error reason
    reason,
  } = params

  if (status === LNURL_STATUS_ERROR) {
    return {
      lnurl,
      status,
      reason,
    }
  }

  if (tag === 'withdrawRequest') {
    return {
      lnurl,
      tag,
      callback,
      secret,
      maxWithdrawable,
      minWithdrawable,
      defaultDescription,
    }
  }
  if (tag === 'channelRequest') {
    return {
      lnurl,
      tag,
      callback,
      secret,
      uri,
    }
  }
  if (tag === 'authRequest') {
    return {
      lnurl,
      tag,
      secret,
    }
  }

  throw new Error(`Unknown request type: "${tag}"`)
}

/**
 * makeWithdrawRequest - Attempts withdraw with the service specified by `callback`.
 *
 * @param {object} params { callback, secret, invoice }
 * @param {string} params.callback service callback to get from
 * @param {string} params.secret k1 lnurl spec secret
 * @param {string}  params.invoice LN request to pay
 * @returns {Promise} request result
 */
export function makeWithdrawRequest({ callback, secret, invoice }) {
  return axios.get(callback, {
    params: {
      k1: secret,
      pr: invoice,
    },
  })
}

/**
 * makeChannelRequest - Attempts channel initiation with the service specified by `callback`.
 *
 * @param {object} params { callback, secret, remoteid }
 * @param {string} params.callback service callback to get from
 * @param {string} params.secret k1 lnurl spec secret
 * @param {string} params.pubkey LN node PubKey to receive incoming channel
 * @param {boolean} params.isPrivate LBoolean indicating if channel should be private
 * @returns {Promise} request result
 */
export function makeChannelRequest({ callback, secret, pubkey, isPrivate }) {
  return axios.get(callback, {
    params: {
      k1: secret,
      remoteid: pubkey,
      private: isPrivate ? 1 : 0,
    },
  })
}

/**
 * makeAuthRequest - Attempts auth with the service specified by `callback`.
 *
 * @param {object} params { callback, secret, invoice }
 * @param {string} params.callback service callback to get from
 * @returns {Promise} request result
 */
export function makeAuthRequest({ callback }) {
  return axios.get(callback)
}

/**
 * parseLnUrl - Decodes specified by `url` lnurl.
 *
 * @param {string} url bech32 encoded lnurl without 'lightning:' protocol part
 * @returns {string|null} decoded lnurl or null if decoding has failed
 */
export function parseLnUrl(url) {
  mainLog.debug('Parsing ln url: %s', url)
  try {
    const { prefix, words } = bech32.decode(url, url.length)
    mainLog.debug('Determined ln url prefix as : %s', prefix)
    if (prefix === 'lnurl') {
      const lnurl = uintToString(bech32.fromWords(words))
      mainLog.debug('Determined ln url as : %s', lnurl)
      return lnurl
    }
    return null
  } catch (e) {
    return null
  }
}
