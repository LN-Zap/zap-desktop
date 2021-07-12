import axios from 'axios'

import { mainLog } from '@zap/utils/log'

import { createConfig } from './providers'

/**
 * requestTicker - Returns ticker for the specified `coin` and `currency` using `provider`.
 *
 * @param {string} provider Provider of interest
 * @param {'BTC'} coin Crypto currency of interest
 * @param {string} currency  Fiat currency of interest
 * @returns {Promise} Promise that resolves to {[currency]:rate} Object. Or empty object
 * if something went wrong
 */
async function requestTicker(provider, coin, currency) {
  mainLog.info('Fetching %s/%s ticker from %s', coin, currency, provider)
  const config = createConfig(coin, currency)
  const { apiUrl, parser } = config[provider] || {}

  if (!(apiUrl && parser)) {
    return {}
  }

  return axios
    .get(apiUrl)
    .then(parser)
    .catch(() => ({}))
}

export default requestTicker
