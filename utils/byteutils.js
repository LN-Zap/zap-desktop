/* eslint-disable no-bitwise */

import CryptoJS from 'crypto-js'

/**
 * byteArrayToWordArray - Convert a word array to a byte array.
 *
 * @param {ByteArray} byteArray Byte array
 * @returns {WordArray} Word array
 */
export function byteArrayToWordArray(byteArray) {
  const wa = []
  let i
  for (i = 0; i < byteArray.length; i++) {
    wa[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i)
  }

  return CryptoJS.lib.WordArray.create(wa, byteArray.length)
}

/**
 * wordToByteArray - Convert a word to a byte array.
 *
 * @param {Word} word Word
 * @param {number} length Length
 * @returns {ByteArray} Byte array
 */
export function wordToByteArray(word, length) {
  const ba = []
  const xFF = 0xff
  if (length > 0) {
    ba.push(word >>> 24)
  }
  if (length > 1) {
    ba.push((word >>> 16) & xFF)
  }
  if (length > 2) {
    ba.push((word >>> 8) & xFF)
  }
  if (length > 3) {
    ba.push(word & xFF)
  }

  return ba
}

/**
 * wordArrayToByteArray - Convert a word array to a byte array.
 *
 * @param {WordArray} wordArray Word array
 * @param {number} wordLength Length
 * @returns {ByteArray} Byte array
 */
export function wordArrayToByteArray(wordArray, wordLength) {
  let length = wordLength
  let words = wordArray
  if (
    Object.prototype.hasOwnProperty.call(wordArray, 'sigBytes') &&
    Object.prototype.hasOwnProperty.call(wordArray, 'words')
  ) {
    length = wordArray.sigBytes
    ;({ words } = wordArray)
  }

  const result = []
  let bytes
  let i = 0
  while (length > 0) {
    bytes = wordToByteArray(words[i], Math.min(4, length))
    length -= bytes.length
    result.push(bytes)
    i += 1
  }
  return result.flat()
}

/**
 * byteToHexString - Convert from bytes to hex string.
 *
 * @param {Uint8Array} uint8arr Bytes to convert.
 * @returns {string} Hex string
 */
export function byteToHexString(uint8arr) {
  if (!uint8arr) {
    return ''
  }
  return Array.prototype.map
    .call(new Uint8Array(uint8arr), x => `00${x.toString(16)}`.slice(-2))
    .join('')
    .toUpperCase()
}

/**
 * hexStringToByte - Convert from bytes to hex string.
 *
 * @param {string} str Hex string to convert
 * @returns {Uint8Array} Bytes
 */
export function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array()
  }

  const a = []
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16))
  }

  return new Uint8Array(a)
}
