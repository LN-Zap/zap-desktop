import axios from 'axios'
import bech32 from 'bech32'

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
 * fetchWithdrawParams - Fetches withdrawal request params from the specified `lnurl`
 *
 * @param {string} lnurl url
 * @returns {object} request params
 * Throws exception if target `lnurl` is not withdrawal request of params weren't successfully
 * fetched
 */
export async function fetchWithdrawParams(lnurl) {
  const {
    data: {
      // a second-level url which would accept a withdrawal Lightning invoice as query parameter
      callback,
      // an ephemeral secret which would allow user to withdraw funds
      k1: secret,
      maxWithdrawable,
      // A default withdrawal invoice description
      defaultDescription,
      // An optional field, defaults to 1 milisats if not present, can not be less than 1 or more than `maxWithdrawable`
      minWithdrawable,
      // action type
      tag,
    },
  } = await axios.get(lnurl)

  if (tag === 'withdrawRequest') {
    return {
      callback,
      secret,
      maxWithdrawable,
      minWithdrawable,
      defaultDescription,
    }
  }

  throw new Error('Unknown request type')
}


/**
 * makeWithdrawRequest - Attempts withdrawal with the service specified by `callback`.
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
 * parseLnUrl - Decodes specified by `url` lnurl.
 *
 * @param {string} url bech32 encoded lnurl without 'lightning:' protocol part
 * @returns {string|null} decoded lnurl or null if decoding has failed
 */
export function parseLnUrl(url) {
  try {
    const { prefix, words } = bech32.decode(url, url.length)
    if (prefix === 'lnurl') {
      return uintToString(bech32.fromWords(words))
    }
    return null
  } catch (e) {
    return null
  }
}
