import axios from 'axios'
import pickBy from 'lodash/pickBy'
import uniq from 'lodash/uniq'
import { mainLog } from '@zap/utils/log'

/**
 * coindeskParser - Parses CoindDesk ticker data.
 *
 * @param {object} data Ticker data
 * @returns {object} Price data from Coinbase
 */
function coindeskParser(data) {
  const { bpi } = data
  return Object.keys(bpi).reduce((acc, next) => {
    acc[next] = bpi[next].rate_float
    return acc
  }, {})
}

/**
 * bitstampParser - Parses Bitstamp ticker data.
 *
 * @param {string} currency Currency name
 * @param {object} data Ticker data
 * @returns {object} Price data from Bitstamp
 */
function bitstampParser(currency, data) {
  return {
    [currency]: data.data.last,
  }
}

/**
 * krakenParser - Parses Kraken ticker data.
 *
 * @param {string} currency Currency name
 * @param {object} data Ticker data
 * @returns {object} Price data from Kraken
 */
function krakenParser(currency, data) {
  const tickerData = data.data.result
  // kraken has weird resulting tickers format like XXBTZUSD
  // so we just pick first key of the result
  const rate = tickerData[Object.keys(tickerData)[0]].c[0]
  return {
    [currency]: rate,
  }
}

/**
 * bitfinexParser - Parses Bitfinex ticker data.
 *
 * @param {string} currency Currency name
 * @param {object} data Ticker data
 * @returns {object} Price data from Bitfinex
 */
function bitfinexParser(currency, data) {
  return {
    [currency]: data.data.last_price,
  }
}

/**
 * createConfig - Creates provider config for the specified `coin` and `currency`.
 *
 * @param {('BTC'|'LTC')} coin Crypto currency of interest
 * @param {string} currency Fiat currency of interest
 * @returns {object} Config object
 */
function createConfig(coin, currency) {
  const scheme =
    (process && process.env.HOT) || (window.env && window.env.HOT) ? '/proxy/' : 'https://'

  const formatUrl = url => `${scheme}${url}`

  const KRAKEN_FORMAT = {
    BTC: 'XBT',
    LTC: 'LTC',
  }
  const config = {
    coinbase: {
      coins: ['BTC', 'LTC'],
      name: 'Coinbase',
      id: 'coinbase',
      apiUrl: formatUrl(`api.coinbase.com/v2/exchange-rates?currency=${coin}`),
      parser: response => response.data.data.rates,
    },
    bitstamp: {
      name: 'Bitstamp',
      id: 'bitstamp',
      coins: ['BTC', 'LTC'],
      currencies: ['USD', 'EUR'],
      apiUrl: formatUrl(`www.bitstamp.net/api/v2/ticker/${coin}${currency}/`),
      parser: bitstampParser.bind(null, currency),
    },
    kraken: {
      name: 'Kraken',
      id: 'kraken',
      coins: ['BTC', 'LTC'],
      currencies: ['EUR', 'USD', 'CAD', 'GBP', 'JPY'],
      apiUrl: formatUrl(`api.kraken.com/0/public/Ticker?pair=${KRAKEN_FORMAT[coin]}${currency}`),
      parser: krakenParser.bind(null, currency),
    },
    bitfinex: {
      name: 'Bitfinex',
      id: 'bitfinex',
      coins: ['BTC'],
      currencies: ['USD', 'EUR'],
      apiUrl: formatUrl(`api.bitfinex.com/v1/pubticker//${coin}${currency}/`),
      parser: bitfinexParser.bind(null, currency),
    },
    coindesk: {
      disabled: true,
      coins: ['BTC'],
      name: 'Coindesk',
      apiUrl: formatUrl(`api.coindesk.com/v1/bpi/currentprice/${coin}.json`),
      parser: coindeskParser,
    },
  }
  // remove disabled providers as well as ones that don't support requested currency or coin
  return pickBy(
    config,
    ({ disabled, coins, currencies }) =>
      !disabled &&
      (!coin || coins.includes(coin)) &&
      (!currencies || !currency || currencies.includes(currency))
  )
}

/**
 * requestTicker - Returns ticker for the specified `coin` and `currency` using `provider`.
 *
 * @param {string} provider Provider of interest
 * @param {('BTC'|'LTC')} coin Crypto currency of interest
 * @param {string} currency  Fiat currency of interest
 * @returns {Promise} Promise that resolves to {[currency]:rate} Object. Or empty object
 * if something went wrong
 */
export async function requestTicker(provider, coin, currency) {
  mainLog.info('Fetching %s/%s ticker from %s', coin, currency, provider)
  const config = createConfig(coin, currency)
  const { apiUrl, parser } = config[provider] || {}

  if (!(apiUrl && parser)) {
    return {}
  }

  return await axios
    .get(apiUrl)
    .then(parser)
    .catch(() => ({}))
}

/**
 * getSupportedProviders - Get list of supported providers for the specified `coin` and `currency`
 * if called with undefined `coin` and/or `currency` - returns all enabled providers.
 *
 * @param {('BTC'|'LTC')} coin Crypto currency of interest
 * @param {string} currency Fiat currency of interest
 * @returns {object} Details of supported rate providers
 */
export function getSupportedProviders(coin, currency) {
  return createConfig(coin, currency)
}

/**
 * requestTickerWithFallback - Returns ticker for the specified `coin` and `currency` using `provider`
 * falls back to `fallback` if operation was unsuccessful.
 *
 * @param {string} provider Provider of interest
 * @param {('BTC'|'LTC')} coin Crypto currency of interest
 * @param {string} currency Fiat currency of interest
 * @returns {Promise} Promise that resolves to {[currency]:rate} Object. Or empty object if something went wrong
 */
export async function requestTickerWithFallback(provider, coin, currency) {
  const fallbackProviders = Object.keys(getSupportedProviders(coin, currency))
  const allProviders = uniq([provider].concat(fallbackProviders))

  // Try each provider sequentially until we get a result.
  let result = {}
  for await (const currentProvider of allProviders) {
    result = await requestTicker(currentProvider, coin, currency)

    // If we got the result we were looking for abort early.
    if (result[currency]) {
      break
    }
    // Otherwise warn arn move onto the next provider.
    mainLog.warn('Unable to fetch %s/%s ticker from %s', coin, currency, currentProvider)
  }

  return result
}
