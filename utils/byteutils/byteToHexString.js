/**
 * byteToHexString - Convert from bytes to hex string.
 *
 * @param {Uint8Array} uint8arr Bytes to convert.
 * @returns {string} Hex string
 */
function byteToHexString(uint8arr) {
  if (!uint8arr) {
    return ''
  }
  return Array.prototype.map
    .call(new Uint8Array(uint8arr), x => `00${x.toString(16)}`.slice(-2))
    .join('')
    .toUpperCase()
}

export default byteToHexString
