import axios from 'axios'
import bech32 from 'bech32'

/**
 *uintToString - Converts uint array to string.
 *
 * @param {Array} uintArray array
 * @returns {string} converted string
 */
function uintToString(uintArray) {
  const encodedString = String.fromCharCode.apply(null, uintArray)
  return decodeURIComponent(escape(encodedString))
}

/**
 *
 */
export async function fetchWithdrawParams(lnurl) {
  const { words } = bech32.decode(lnurl, lnurl.length)
  const serviceUrl = uintToString(bech32.fromWords(words))
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
  } = await axios.get(serviceUrl)

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
 *
 */
export function makeWithdrawRequest({ callback, secret, invoice }) {
  return axios.get(callback, {
    k1: secret,
    invoice,
  })
}
