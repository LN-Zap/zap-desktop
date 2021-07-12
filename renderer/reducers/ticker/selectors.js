import get from 'lodash/get'
import { createSelector } from 'reselect'

import { settingsSelectors } from 'reducers/settings'

const cryptoUnitsSelector = state => state.ticker.cryptoUnits
const ratesSelector = state => state.ticker.rates
const fiatTickerSelector = state => settingsSelectors.currentConfig(state).currency
const fiatTickersSelector = state => state.ticker.fiatTickers
const tickerLoadingSelector = state => state.ticker.tickerLoading
const chainSelector = state => state.info.chain
const networkSelector = state => state.info.network
const networksSelector = state => state.info.networks
const networkInfoSelector = createSelector(
  chainSelector,
  networkSelector,
  networksSelector,
  (chain, network, networks) => get(networks, `${chain}.${network}`)
)

const tickerSelectors = {}

tickerSelectors.tickerLoading = tickerLoadingSelector
tickerSelectors.fiatTicker = fiatTickerSelector
tickerSelectors.fiatTickers = fiatTickersSelector

tickerSelectors.cryptoUnit = createSelector(
  settingsSelectors.currentConfig,
  chainSelector,
  (currentConfig, chain) => {
    return get(currentConfig, `units.${chain}`, null)
  }
)

tickerSelectors.currentTicker = createSelector(ratesSelector, rates => rates || {})

tickerSelectors.cryptoUnits = createSelector(
  chainSelector,
  networkInfoSelector,
  cryptoUnitsSelector,
  (chain, networkInfo, cryptoUnits) => {
    if (!chain || !networkInfo) {
      return []
    }
    return cryptoUnits[chain].map(item => ({
      ...item,
      name: `${networkInfo.unitPrefix}${item.value}`,
    }))
  }
)

// selector for currency address name e.g BTC, tBTC etc
tickerSelectors.cryptoAddressName = createSelector(
  chainSelector,
  tickerSelectors.cryptoUnits,
  (chain, cryptoUnits = []) => {
    // assume first entry is as a currency ticker name (e.g BTC)
    const [selectedUnit] = cryptoUnits
    if (selectedUnit) {
      return selectedUnit.name
    }
    // fallback in case something is very wrong
    return chain
  }
)

tickerSelectors.cryptoUnitName = createSelector(
  tickerSelectors.cryptoUnit,
  tickerSelectors.cryptoUnits,
  (unit, cryptoUnits = []) => {
    const selectedUnit = cryptoUnits.find(c => c.key === unit)
    if (selectedUnit) {
      return selectedUnit.name
    }
    // fallback in case something is very wrong
    return unit
  }
)

/**
 * Returns autopay limit currency unit name
 */
tickerSelectors.autopayCurrencyName = createSelector(
  tickerSelectors.cryptoUnits,
  cryptoUnits => cryptoUnits && cryptoUnits[cryptoUnits.length - 1].value
)

export default tickerSelectors
