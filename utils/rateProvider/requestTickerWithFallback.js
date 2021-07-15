import uniq from 'lodash/uniq'

import { mainLog } from '@zap/utils/log'

import { getSupportedProviders } from './providers'
import requestTicker from './requestTicker'
/**
 * requestTickerWithFallback - Returns ticker for the specified `coin` and `currency` using `provider`
 * falls back to `fallback` if operation was unsuccessful.
 *
 * @param {string} provider Provider of interest
 * @param {'BTC'} coin Crypto currency of interest
 * @param {string} currency Fiat currency of interest
 * @returns {Promise} Promise that resolves to {[currency]:rate} Object. Or empty object if something went wrong
 */
async function requestTickerWithFallback(provider, coin, currency) {
  const fallbackProviders = Object.keys(getSupportedProviders(coin, currency))
  const allProviders = uniq([provider].concat(fallbackProviders))

  // Try each provider sequentially until we get a result.
  let result = {}
  for (const currentProvider of allProviders) {
    try {
      // Attempt to fetch the ticker data.
      // eslint-disable-next-line no-await-in-loop
      result = await requestTicker(currentProvider, coin, currency)
      // If we got the result we were looking for abort early.
      if (result[currency]) {
        break
      }
      throw new Error('No data')
    } catch (e) {
      mainLog.warn('Unable to fetch %s/%s ticker from %s: %o', coin, currency, currentProvider, e)
    }
  }

  return result
}

export default requestTickerWithFallback
