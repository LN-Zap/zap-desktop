import { randomBytes } from 'crypto'

import lightningRequestReq from '@ln-zap/bolt11'
import bip21 from 'bip21'
import { address } from 'bitcoinjs-lib'
import coininfo from 'coininfo'
import config from 'config'
import get from 'lodash/get'
import range from 'lodash/range'

import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { sha256digest } from '@zap/utils/sha256'

export const PREIMAGE_BYTE_LENGTH = 32

export const networks = {
  bitcoin: {
    mainnet: coininfo.bitcoin.main.toBitcoinJS(),
    testnet: coininfo.bitcoin.test.toBitcoinJS(),
    regtest: coininfo.bitcoin.regtest.toBitcoinJS(),
    simnet: coininfo.bitcoin.simnet.toBitcoinJS(),
  },
}

export const coinTypes = {
  bitcoin: {
    mainnet: 'bc',
    testnet: 'tb',
    regtest: 'bcrt',
    simnet: 'sb',
  },
}

/**
 * decodePayReq - Decodes a payment request.
 *
 * @param {string} payReq Payment request
 * @param {boolean} addDefaults Boolean indicating whether to inject default values (default=true)
 * @returns {*} Decoded payment request
 */
export const decodePayReq = (payReq, addDefaults = true) => {
  const data = lightningRequestReq.decode(payReq)
  const expiryTag = data.tags.find(t => t.tagName === 'expire_time') || {}
  const expiry = expiryTag.data
  if (addDefaults && !expiry) {
    data.tags.push({
      tagName: 'expire_time',
      data: 3600,
    })
    data.timeExpireDate = data.timestamp + 3600
    data.timeExpireDateString = new Date(data.timeExpireDate * 1000).toISOString()
  }
  return data
}

/**
 * getTag = Get tag data for `tagName` from a decoded bolt11 invoice.
 *
 * @param {string|object} invoice Payment request or decoded bolt11 invoice
 * @param {string} tagName Tag to fetch
 * @returns {*|null} Tag data or null if not found
 */
export const getTag = (invoice, tagName) => {
  try {
    const decodedInvoice = typeof invoice === 'string' ? decodePayReq(invoice) : invoice
    return decodedInvoice.tags.find(t => t.tagName === tagName).data
  } catch (e) {
    return null
  }
}

/**
 * formatValue - Turns parsed number into a string.
 *
 * @param {number|string} integer Integer part
 * @param {number|string} fractional Fractional part
 * @returns {*} Formatted value
 */
export const formatValue = (integer, fractional) => {
  let value
  if (fractional && fractional.length > 0) {
    value = `${integer}.${fractional}`
  }
  // Empty string means `XYZ.` instead of just plain `XYZ`.
  else if (fractional === '') {
    value = `${integer}.`
  } else {
    value = `${integer}`
  }
  return value
}

/**
 * parseNumber - Splits number into integer and fraction.
 *
 * @param {number|string} _value Value to parse
 * @param {number} precision Decimal precision
 * @returns {Array} Parsed value
 */
export const parseNumber = (_value, precision) => {
  let value = String(_value || '')
  if (typeof _value === 'string') {
    value = _value.replace(/[^0-9.]/g, '')
  }
  let integer = null
  let fractional = null
  if (CoinBig(value).lt(0)) {
    value = '0.0'
  }
  // parse integer and fractional value so that we can reproduce the same string value afterwards
  // [0, 0] === 0.0
  // [0, ''] === 0.
  // [0, null] === 0
  if (value.match(/^[0-9]*\.[0-9]*$/)) {
    ;[integer, fractional] = value.toString().split(/\./)
    if (!fractional) {
      fractional = ''
    }
  } else {
    integer = value
  }
  // Limit fractional precision to the correct number of decimal places.
  if (fractional && fractional.length > precision) {
    fractional = fractional.substring(0, precision)
  }

  return [integer, fractional]
}

/**
 * isOnchain - Test to see if a string is a valid on-chain address.
 *
 * @param {string} input Value to check
 * @param {string} chain Chain name
 * @param {string} network Network name
 * @returns {boolean} Boolean indicating whether the address is a valid on-chain address
 */
export const isOnchain = (input, chain, network) => {
  if (!input || !chain || !network) {
    return false
  }

  try {
    address.toOutputScript(input, networks[chain][network])
    return true
  } catch (e) {
    return false
  }
}

/**
 * isBip21 - Test to see if a string is a valid bip21 payment uri
 *
 * @param {string} input Value to check
 * @returns {boolean} Boolean indicating whether the address is a valid bip21 payment uri
 */
export const isBip21 = input => {
  if (!input) {
    return false
  }

  try {
    bip21.decode(input)
    return true
  } catch (e) {
    return false
  }
}

/**
 * isBolt11 - Test to see if a string is a valid lightning address.
 *
 * @param {string} input Value to check
 * @param {string} chain Chain name
 * @param {string} network Network name
 * @returns {boolean} Boolean indicating whether the address is a lightning address
 */
export const isBolt11 = (input, chain = 'bitcoin', network = 'mainnet') => {
  if (!input || typeof input !== 'string') {
    return false
  }
  try {
    const decoded = lightningRequestReq.decode(input)
    if (decoded.network.bech32 !== get(coinTypes, `${chain}.${network}`)) {
      throw new Error('Invalid coin type')
    }
    return true
  } catch (e) {
    return false
  }
}

/**
 * isPubkey - Test to see if a string is a valid pubkey.
 *
 * @param {string} input Value to check
 * @returns {boolean} Boolean indicating whether the address is a pubkey
 */
export const isPubkey = input => {
  if (!input || typeof input !== 'string') {
    return false
  }
  return input.length === 66 && /^[0-9a-fA-F]+$/.test(input)
}

/**
 * getNodeAlias - Get a nodes alias.
 *
 * @param {string} pubkey pubKey of node to fetch alias for.
 * @param {Array} nodes listof nodes to search.
 * @returns {string} Node alias, if found
 */
export const getNodeAlias = (pubkey, nodes = []) => {
  if (!pubkey) {
    return null
  }

  const node = nodes.find(n => n.pubKey === pubkey)
  if (node && node.alias.length) {
    return node.alias
  }

  return null
}

/**
 * getMinFee - Given a list of routes, find the minimum fee.
 *
 * @param {Array} routes List of routes
 * @returns {number} minimum fee (satoshi)
 */
export const getMinFee = (routes = []) => {
  if (!routes || !routes.length) {
    return null
  }
  let fee = routes.reduce((min, b) => CoinBig.min(min, b.totalFeesMsat), routes[0].totalFeesMsat)

  // Add one to the fee to add room for accuracy error when using as a fee limit.
  fee = CoinBig.sum(fee, 1000)

  return convert('msats', 'sats', fee)
}

/**
 * getMaxFee - Given a list of routes, find the maximum fee.
 *
 * @param {Array} routes List of routes
 * @returns {number} maximum fee (satoshi)
 */
export const getMaxFee = routes => {
  if (!routes || !routes.length) {
    return null
  }
  let fee = routes.reduce((max, b) => CoinBig.max(max, b.totalFeesMsat), routes[0].totalFeesMsat)

  // Add one to the fee to add room for accuracy error when using as a fee limit.
  fee = CoinBig.sum(fee, 1000)

  return convert('msats', 'sats', fee)
}

/**
 * getMaxFee - Given a list of routes, find the exact fee from the first route.
 *
 * @param {Array} routes List of routes
 * @returns {number} exact fee (msats)
 */
export const getExactFee = routes => {
  if (!routes || !routes.length) {
    return null
  }
  const route = routes.find(r => r.isExact)
  return route ? convert('msats', 'sats', route.totalFeesMsat) : null
}

/**
 * getMaxFee - Given a list of routes, find the maximum fee factoring in all possible payment retry attempts.
 *
 * @param {Array} routes List of routes
 * @returns {number} maximum fee (satoshi)
 */
export const getMaxFeeInclusive = routes => {
  if (!routes || !routes.length) {
    return null
  }

  const {
    invoices: { retryCount, feeIncrementExponent },
  } = config

  let fee = getMaxFee(routes)

  fee = range(retryCount).reduce(
    max =>
      CoinBig(max)
        .times(feeIncrementExponent)
        .decimalPlaces(0),
    fee
  )
  return fee.toString()
}

/**
 * getFeeRange - Given a list of routest, find the maximum and maximum fee.
 *
 * @param {Array} routes List of routes
 * @returns {{min:number, max:number}} object with keys `min` and `max`
 */
export const getFeeRange = (routes = []) => ({
  min: getMinFee(routes),
  max: getMaxFee(routes),
})

/**
 * generateHash - Generates 32 random bytes suitible for use as a preimage.
 *
 * @returns {Uint8Array} hash bytes
 */
export const generatePreimage = () => randomBytes(PREIMAGE_BYTE_LENGTH)

/**
 * generateHash - Generates probe hash from payment hash.
 *
 * @param {string} paymentHash payment hash (hex)
 * @returns {Uint8Array} probe hash (bytes)
 */
export const generateProbeHash = paymentHash => {
  const idx = Buffer.from('probing-01:', 'utf8')
  const hash = Buffer.from(paymentHash, 'hex')
  const totalLength = idx.length + hash.length

  const probeHashBuffer = Buffer.concat([idx, hash], totalLength)
  const probeHash = sha256digest(probeHashBuffer)

  return probeHash
}
