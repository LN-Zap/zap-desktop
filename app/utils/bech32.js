// Using bech32 here just without the 90 char length: https://github.com/bitcoinjs/bech32/blob/master/index.js

/* eslint-disable */

'use strict'
let ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

// pre-compute lookup table
let ALPHABET_MAP = {}
for (let z = 0; z < ALPHABET.length; z++) {
  let x = ALPHABET.charAt(z)

  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
  ALPHABET_MAP[x] = z
}

function polymodStep (pre) {
  let b = pre >> 25
  return ((pre & 0x1FFFFFF) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
}

function prefixChk (prefix) {
  let chk = 1
  for (let i = 0; i < prefix.length; ++i) {
    let c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) throw new Error('Invalid prefix (' + prefix + ')')

    chk = polymodStep(chk) ^ (c >> 5)
  }
  chk = polymodStep(chk)

  for (let i = 0; i < prefix.length; ++i) {
    let v = prefix.charCodeAt(i)
    chk = polymodStep(chk) ^ (v & 0x1f)
  }
  return chk
}

function encode (prefix, words) {
  // too long?
  if ((prefix.length + 7 + words.length) > 90) throw new TypeError('Exceeds Bech32 maximum length')
  prefix = prefix.toLowerCase()

  // determine chk mod
  let chk = prefixChk(prefix)
  let result = prefix + '1'
  for (let i = 0; i < words.length; ++i) {
    let x = words[i]
    if ((x >> 5) !== 0) throw new Error('Non 5-bit word')

    chk = polymodStep(chk) ^ x
    result += ALPHABET.charAt(x)
  }

  for (let i = 0; i < 6; ++i) {
    chk = polymodStep(chk)
  }
  chk ^= 1

  for (let i = 0; i < 6; ++i) {
    let v = (chk >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

function decode (str) {
  if (str.length < 8) throw new TypeError(str + ' too short')
  // LN payment requests can be longer than 90 chars
  // if (str.length > 90) throw new TypeError(str + ' too long')

  // don't allow mixed case
  let lowered = str.toLowerCase()
  let uppered = str.toUpperCase()
  if (str !== lowered && str !== uppered) throw new Error('Mixed-case string ' + str)
  str = lowered

  let split = str.lastIndexOf('1')
  if (split === 0) throw new Error('Missing prefix for ' + str)

  let prefix = str.slice(0, split)
  let wordChars = str.slice(split + 1)
  if (wordChars.length < 6) throw new Error('Data too short')

  let chk = prefixChk(prefix)
  let words = []
  for (let i = 0; i < wordChars.length; ++i) {
    let c = wordChars.charAt(i)
    let v = ALPHABET_MAP[c]
    if (v === undefined) throw new Error('Unknown character ' + c)
    chk = polymodStep(chk) ^ v

    // not in the checksum?
    if (i + 6 >= wordChars.length) continue
    words.push(v)
  }

  if (chk !== 1) throw new Error('Invalid checksum for ' + str)
  return { prefix, words }
}

function convert (data, inBits, outBits, pad) {
  let value = 0
  let bits = 0
  let maxV = (1 << outBits) - 1

  let result = []
  for (let i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }
  } else {
    if (bits >= inBits) throw new Error('Excess padding')
    if ((value << (outBits - bits)) & maxV) throw new Error('Non-zero padding')
  }

  return result
}

function toWords (bytes) {
  return convert(bytes, 8, 5, true)
}

function fromWords (words) {
  return convert(words, 5, 8, false)
}

export default {
  decode,
  encode,
  toWords,
  fromWords
}

