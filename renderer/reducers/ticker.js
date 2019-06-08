import { createSelector } from 'reselect'
import get from 'lodash/get'
import { requestTickers } from '@zap/utils/api'
import { currencies, getDefaultCurrency } from '@zap/i18n'
import { putConfig, settingsSelectors } from './settings'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_TICKERS = 'GET_TICKERS'
export const RECIEVE_TICKERS = 'RECIEVE_TICKERS'

// ------------------------------------
// Actions
// ------------------------------------

export const initTickers = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentTicker = fiatTickerSelector(state)

  if (currentConfig.currency !== currentTicker) {
    dispatch(setFiatTicker(currentConfig.currency))
  }

  await dispatch(fetchTickers())
}

export const setCryptoUnit = unit => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const chain = chainSelector(state)
  const savedUnit = currentConfig.units[chain]
  if (unit !== savedUnit) {
    await dispatch(putConfig(`units.${chain}`, unit))
  }
}

export const setFiatTicker = fiatTicker => async dispatch => {
  await dispatch(putConfig('currency', fiatTicker))
}

export function getTickers() {
  return {
    type: GET_TICKERS,
  }
}

export function recieveTickers({ btcTicker, ltcTicker }) {
  return {
    type: RECIEVE_TICKERS,
    btcTicker,
    ltcTicker,
  }
}

export const fetchTickers = () => async dispatch => {
  dispatch(getTickers())
  const tickers = await requestTickers(['btc', 'ltc'])
  dispatch(recieveTickers(tickers))

  return tickers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_TICKERS]: state => ({ ...state, tickerLoading: true }),
  [RECIEVE_TICKERS]: (state, { btcTicker, ltcTicker }) => ({
    ...state,
    tickerLoading: false,
    btcTicker,
    ltcTicker,
  }),
}

// Selectors
const cryptoUnitsSelector = state => state.ticker.cryptoUnits
const bitcoinTickerSelector = state => state.ticker.btcTicker
const litecoinTickerSelector = state => state.ticker.ltcTicker
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

tickerSelectors.currentTicker = createSelector(
  chainSelector,
  bitcoinTickerSelector,
  litecoinTickerSelector,
  (chain, btcTicker, ltcTicker) => {
    switch (chain) {
      case 'bitcoin':
        return btcTicker
      case 'litecoin':
        return ltcTicker
      default:
        return null
    }
  }
)

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
    // assume first entry is as a currency ticker name (e.g BTC, LTC etc)
    const [selectedUnit] = cryptoUnits
    if (selectedUnit) {
      return selectedUnit.value
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
      return selectedUnit.value
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

export { tickerSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  tickerLoading: false,
  btcTicker: null,
  ltcTicker: null,
  fiatTicker: getDefaultCurrency(),
  fiatTickers: currencies,
  cryptoUnits: {
    bitcoin: [
      {
        key: 'btc',
        value: 'BTC',
      },
      {
        key: 'bits',
        value: 'bits',
      },
      {
        key: 'sats',
        value: 'satoshis',
      },
    ],
    litecoin: [
      {
        key: 'ltc',
        value: 'LTC',
      },
      {
        key: 'phots',
        value: 'photons',
      },
      {
        key: 'lits',
        value: 'litoshis',
      },
    ],
  },
}

export default function tickerReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
