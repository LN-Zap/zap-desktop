import { createSelector } from 'reselect'
import get from 'lodash.get'
import { requestTickers } from '@zap/utils/api'
import { currencies, getDefaultCurrency } from '@zap/i18n'
import { putConfig, settingsSelectors } from './settings'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CURRENCY = 'SET_CURRENCY'
export const SET_CRYPTO = 'SET_CRYPTO'
export const SET_FIAT_TICKER = 'SET_FIAT_TICKER'
export const GET_TICKERS = 'GET_TICKERS'
export const RECIEVE_TICKERS = 'RECIEVE_TICKERS'

// Map for crypto names to crypto tickers
const CRYPTO_NAMES = {
  bitcoin: 'Bitcoin',
  litecoin: 'Litecoin',
}

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

export const setCurrency = unit => async (dispatch, getState) => {
  dispatch({
    type: SET_CURRENCY,
    currency: unit,
  })
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const chain = cryptoSelector(state)
  const savedUnit = currentConfig.units[chain]
  if (unit !== savedUnit) {
    await dispatch(putConfig(`units.${chain}`, unit))
  }
}

export function setCrypto(crypto) {
  return {
    type: SET_CRYPTO,
    crypto,
  }
}

export const setFiatTicker = fiatTicker => async dispatch => {
  // Persist the new fiatTicker in the store.
  dispatch({ type: SET_FIAT_TICKER, fiatTicker })

  // Persist the new fiatTicker saetting.
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

// Receive IPC event for receiveCryptocurrency
export const receiveCryptocurrency = chain => async (dispatch, getState) => {
  dispatch(setCrypto(chain))

  // Load saved settings for the chain.
  const currentConfig = settingsSelectors.currentConfig(getState())

  // Set currency unit based on saved setting, or fallback to default value.
  const unit = get(currentConfig, `units.${chain}`)
  dispatch(setCurrency(unit))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CURRENCY]: (state, { currency }) => ({ ...state, fromCurrency: state.currency, currency }),
  [SET_CRYPTO]: (state, { crypto }) => ({ ...state, crypto }),
  [SET_FIAT_TICKER]: (state, { fiatTicker }) => ({ ...state, fiatTicker }),
  [GET_TICKERS]: state => ({ ...state, tickerLoading: true }),
  [RECIEVE_TICKERS]: (state, { btcTicker, ltcTicker }) => ({
    ...state,
    tickerLoading: false,
    btcTicker,
    ltcTicker,
  }),
}

// Selectors
const cryptoSelector = state => state.ticker.crypto
const currencySelector = state => state.ticker.currency
const currencyFiltersSelector = state => state.ticker.currencyFilters
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

tickerSelectors.currency = currencySelector
tickerSelectors.tickerLoading = tickerLoadingSelector
tickerSelectors.fiatTicker = fiatTickerSelector
tickerSelectors.fiatTickers = fiatTickersSelector

tickerSelectors.currentTicker = createSelector(
  cryptoSelector,
  bitcoinTickerSelector,
  litecoinTickerSelector,
  (crypto, btcTicker, ltcTicker) => {
    switch (crypto) {
      case 'bitcoin':
        return btcTicker
      case 'litecoin':
        return ltcTicker
      default:
        return null
    }
  }
)

tickerSelectors.cryptoName = createSelector(
  cryptoSelector,
  crypto => CRYPTO_NAMES[crypto]
)

tickerSelectors.currencyFilters = createSelector(
  cryptoSelector,
  networkInfoSelector,
  currencyFiltersSelector,
  (crypto, networkInfo, currencyFilters) => {
    if (!crypto || !networkInfo) {
      return []
    }
    return currencyFilters[crypto].map(item => ({
      ...item,
      name: `${networkInfo.unitPrefix}${item.name}`,
    }))
  }
)

// selector for currency address name e.g BTC, tBTC etc
tickerSelectors.currencyAddressName = createSelector(
  cryptoSelector,
  tickerSelectors.currencyFilters,
  (crypto, currencyFilters = []) => {
    // assume first entry is as a currency ticker name (e.g BTC, LTC etc)
    const [selectedCurrency] = currencyFilters
    if (selectedCurrency) {
      return selectedCurrency.name
    }
    // fallback in case something is very wrong
    return crypto
  }
)

tickerSelectors.currencyName = createSelector(
  currencySelector,
  tickerSelectors.currencyFilters,
  (currency, currencyFilters = []) => {
    let unit = currency
    const selectedCurrency = currencyFilters.find(c => c.key === currency)
    if (selectedCurrency) {
      unit = selectedCurrency.name
    }
    return unit
  }
)

/**
 * Returns autopay limit currency unit name
 */
tickerSelectors.autopayCurrencyName = createSelector(
  tickerSelectors.currencyFilters,
  currencyFilters => currencyFilters && currencyFilters[currencyFilters.length - 1].name
)

export { tickerSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  tickerLoading: false,
  currency: null,
  fromCurrency: null,
  crypto: null,
  btcTicker: null,
  ltcTicker: null,
  fiatTicker: getDefaultCurrency(),
  fiatTickers: currencies,
  currencyFilters: {
    bitcoin: [
      {
        key: 'btc',
        name: 'BTC',
      },
      {
        key: 'bits',
        name: 'bits',
      },
      {
        key: 'sats',
        name: 'satoshis',
      },
    ],
    litecoin: [
      {
        key: 'ltc',
        name: 'LTC',
      },
      {
        key: 'phots',
        name: 'photons',
      },
      {
        key: 'lits',
        name: 'litoshis',
      },
    ],
  },
}

export default function tickerReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
