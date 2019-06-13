import axios from 'axios'
import pickBy from 'lodash/pickBy'
import map from 'lodash/map'

/**
 * coindeskParser - parser CoindDesk ticker data.
 *
 * @param {*} data
 * @returns
 */
function coindeskParser(data) {
  const { bpi } = data
  return Object.keys(bpi).reduce((acc, next) => {
    acc[next] = bpi[next].rate_float
    return acc
  }, {})
}

/**
 * bitstampParser - parser Bitstamp ticker data.
 *
 * @param {string} currency
 * @param {object} data
 * @returns {object}
 */
function bitstampParser(currency, data) {
  return {
    [currency]: data.data.last,
  }
}

/**
 * krakenParser - parser Kraken ticker data.
 *
 * @param {string} currency
 * @param {object} data
 * @returns {object}
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
 * bitfinexParser - parser Bitfinex ticker data.
 *
 * @param {string} currency
 * @param {object} data
 * @returns {object}
 */
function bitfinexParser(currency, data) {
  return {
    [currency]: data.data.last_price,
  }
}

/**
 * createConfig - creates provider config for the specified `coin` and `currency`.
 *
 * @export
 * @returns {object}
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
    cosinbase: {
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
      !disabled && coins.includes(coin) && (!currencies || currencies.includes(currency))
  )
}

/**
 * requestTicker - returns ticker for the specified `coin` and `currency` using `provider`.
 *
 * @param {string} provider
 * @param {('BTC'|'LTC')} coin
 * @param {string} currency  fiat currency of interest
 * @returns {Promise} promise that resolves to {[currency]:rate} Object. Or empty object
 * if something went wrong
 */
export async function requestTicker(provider, coin, currency) {
  const config = createConfig(coin, currency)
  const { apiUrl, parser } = config[provider] || {}
  return await axios
    .get(apiUrl)
    .then(parser)
    .catch(() => ({}))
}

/**
 * getSupportedProviders - get list of supported providers  for the specified `coin` and `currency`
 *
 * @export
 * @param {('BTC'|'LTC')} coin
 * @param {string} currency - fiat currency of interest
 * @returns {Array<string>} list of supported rate providers
 */
export function getSupportedProviders(coin, currency) {
  const config = createConfig(coin, currency)
  const result = map(config, 'id')
  return result
}

/**
 * requestTickerWithFallback - returns ticker for the specified `coin` and `currency` using `provider`
 * falls back to `fallback` if operation was unsuccessful.
 *
 * @param {string} provider
 * @param {('BTC'|'LTC')} coin
 * @param {string} currency - fiat currency of interest
 * @param {string} fallback - fallback provider name
 * @returns {Promise} promise that resolves to {[currency]:rate} Object. Or empty object
 * if something went wrong
 */
export async function requestTickerWithFallback(provider, coin, currency, fallback = 'coinbase') {
  const result = await requestTicker(provider, coin, currency)
  if (!result[currency] && provider !== fallback) {
    return await requestTicker(fallback, coin)
  }
  return result
}
