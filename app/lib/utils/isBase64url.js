/**
 * Checks whether specified string is base64 url encoded
 * @returns {boolean}
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
module.exports = isBase64url
