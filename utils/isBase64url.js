/**
 * isBase64url - Checks whether specified string is base64 url encoded.
 *
 * @param  {string}   str Parent directory
 * @returns {boolean} Boolean indicating wether str is a base64url encoded
 */
const isBase64url = str => {
  try {
    //convert from base64url to base64
    window.atob(str.replace(/-/g, '+').replace(/_/g, '/'))
    return true
  } catch (e) {
    return false
  }
}

export default isBase64url
