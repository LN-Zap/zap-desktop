import get from 'lodash.get'
import bitcoin from 'bitcoinjs-lib'
import lightningRequestReq from 'bolt11'
import coininfo from 'coininfo'

export const networks = {
  bitcoin: {
    mainnet: coininfo.bitcoin.main.toBitcoinJS(),
    testnet: coininfo.bitcoin.test.toBitcoinJS(),
    regtest: coininfo.bitcoin.regtest.toBitcoinJS(),
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
  },
  litecoin: {
    mainnet: 'litecoin',
    testnet: 'litecoin_testnet',
  },
}

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
 * Turns parsed number into a string.
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
 * Splits number into integer and fraction.
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
 * Test to see if a string is a valid on-chain address.
 * @param {String} input string to check.
 * @param {String} [network='mainnet'] network to check (mainnet, testnet).
 * @return {Boolean} boolean indicating wether the address is a valid on-chain address.
 */
export const isOnchain = (input, chain, network) => {
  if (!input || !chain || !network) {
    return false
  }

  try {
    bitcoin.address.toOutputScript(input, networks[chain][network])
    return true
  } catch (e) {
    return false
  }
}

/**
 * Test to see if a string is a valid lightning address.
 * @param {String} input string to check.
 * @param {String} [network='bitcoin'] chain to check (bitcoin, litecoin).
 * @param {String} [network='mainnet'] network to check (mainnet, testnet, regtest).
 * @return {Boolean} boolean indicating wether the address is a lightning address.
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
 * Get a nodes alias.
 * @param {String} pubkey pubKey of node to fetch alias for.
 * @param {Array} Node list to search.
 * @return {String} Node alias, if found
 */
export const getNodeAlias = (pubkey, nodes = []) => {
  const node = nodes.find(n => n.pub_key === pubkey)

  if (node && node.alias.length) {
    return node.alias
  }

  return null
}

/**
 * Given a list of routest, find the minimum fee.
 * @param {QueryRoutesResponse} routes
 * @return {Number} minimum fee rounded up to the nearest satoshi.
 */
export const getMinFee = (routes = []) => {
  if (!routes || !routes.length) {
    return null
  }
  return routes.reduce((min, b) => Math.min(min, b.total_fees), routes[0].total_fees)
}

/**
 * Given a list of routest, find the maximum fee.
 * @param {QueryRoutesResponse} routes
 * @return {Number} maximum fee.
 */
export const getMaxFee = routes => {
  if (!routes || !routes.length) {
    return null
  }
  return routes.reduce((max, b) => Math.max(max, b.total_fees), routes[0].total_fees)
}

/**
 * Given a list of routest, find the maximum and maximum fee.
 * @param {QueryRoutesResponse} routes
 * @return {Object} object with kets `min` and `max`
 */
export const getFeeRange = (routes = []) => ({
  min: getMinFee(routes),
  max: getMaxFee(routes),
})
