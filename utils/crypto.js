import get from 'lodash/get'
import { address } from 'bitcoinjs-lib'
import lightningRequestReq from 'bolt11'
import coininfo from 'coininfo'

export const networks = {
  bitcoin: {
    mainnet: coininfo.bitcoin.main.toBitcoinJS(),
    testnet: coininfo.bitcoin.test.toBitcoinJS(),
    regtest: coininfo.bitcoin.regtest.toBitcoinJS(),
    simnet: coininfo.bitcoin.simnet.toBitcoinJS(),
  },
  litecoin: {
    mainnet: coininfo.litecoin.main.toBitcoinJS(),
    testnet: coininfo.litecoin.test.toBitcoinJS(),
  },
}

export const coinTypes = {
  bitcoin: {
    mainnet: 'bitcoin',
    testnet: 'testnet',
    regtest: 'regtest',
    simnet: 'simnet',
  },
  litecoin: {
    mainnet: 'litecoin',
    testnet: 'litecoin_testnet',
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
  const expiry = data.tags.find(t => t.tagName === 'expire_time')
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
 * extractMemo - Extracts memo from a payment request.
 *
 * @param {string} payReq Payment request
 * @returns {string|null} Memo
 */
export const extractMemo = payReq => {
  try {
    if (payReq) {
      const request = decodePayReq(payReq)
      const descriptionTag = request.tags.find(tag => tag.tagName === 'description') || {}
      return descriptionTag.data
    }
    return null
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
  } else {
    // Empty string means `XYZ.` instead of just plain `XYZ`.
    if (fractional === '') {
      value = `${integer}.`
    } else {
      value = `${integer}`
    }
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
  if (value * 1.0 < 0) {
    value = '0.0'
  }
  // pearse integer and fractional value so that we can reproduce the same string value afterwards
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
 * isLn - Test to see if a string is a valid lightning address.
 *
 * @param {string} input Value to check
 * @param {string} chain Chain name
 * @param {string} network Network name
 * @returns {boolean} Boolean indicating whether the address is a lightning address
 */
export const isLn = (input, chain = 'bitcoin', network = 'mainnet') => {
  if (!input || typeof input !== 'string') {
    return false
  }
  try {
    const decoded = lightningRequestReq.decode(input)
    if (decoded.coinType !== get(coinTypes, `${chain}.${network}`)) {
      throw new Error('Invalid coin type')
    }
    return true
  } catch (e) {
    return false
  }
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

  const node = nodes.find(n => n.pub_key === pubkey)
  if (node && node.alias.length) {
    return node.alias
  }

  return null
}

/**
 * getMinFee - Given a list of routest, find the minimum fee.
 *
 * @param {*} routes List of routes
 * @returns {number} minimum fee rounded up to the nearest satoshi
 */
export const getMinFee = (routes = []) => {
  if (!routes || !routes.length) {
    return null
  }
  const fee = routes.reduce((min, b) => Math.min(min, b.total_fees), routes[0].total_fees)

  // Add one to the fee to add room for accuracy error when using as a fee limit.
  return fee + 1
}

/**
 * getMaxFee - Given a list of routest, find the maximum fee.
 *
 * @param {*} routes List of routes
 * @returns {number} maximum fee
 */
export const getMaxFee = routes => {
  if (!routes || !routes.length) {
    return null
  }
  const fee = routes.reduce((max, b) => Math.max(max, b.total_fees), routes[0].total_fees)

  // Add one to the fee to add room for accuracy error when using as a fee limit.
  return fee + 1
}

/**
 * getFeeRange - Given a list of routest, find the maximum and maximum fee.
 *
 * @param {*} routes List of routes
 * @returns {{min:number, max:number}} object with keys `min` and `max`
 */
export const getFeeRange = (routes = []) => ({
  min: getMinFee(routes),
  max: getMaxFee(routes),
})
