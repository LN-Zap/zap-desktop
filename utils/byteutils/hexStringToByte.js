/**
 * hexStringToByte - Convert from bytes to hex string.
 *
 * @param {string} str Hex string to convert
 * @returns {Uint8Array} Bytes
 */
function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array()
  }

  const a = []
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16))
  }

  return new Uint8Array(a)
}

export default hexStringToByte
