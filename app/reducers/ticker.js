import { createSelector } from 'reselect'
import { requestTicker } from 'lib/utils/api'
import { currencies, getDefaultCurrency } from 'lib/i18n'
import db from 'store/db'
import { infoSelectors } from './info'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CURRENCY = 'SET_CURRENCY'
export const SET_CRYPTO = 'SET_CRYPTO'
export const SET_FIAT_TICKER = 'SET_FIAT_TICKER'
export const GET_TICKERS = 'GET_TICKERS'
export const RECIEVE_TICKERS = 'RECIEVE_TICKERS'

// Map for crypto names to crypto tickers
const cryptoTickers = {
  bitcoin: 'btc',
  litecoin: 'ltc'
}

// ------------------------------------
// Actions
// ------------------------------------
export function setCurrency(currency) {
  return {
    type: SET_CURRENCY,
    currency
  }
}

export function setCrypto(crypto) {
  return {
    type: SET_CRYPTO,
    crypto
  }
}

export function setFiatTicker(fiatTicker) {
  // Persist the new fiatTicker in our ticker store
  db.settings.put({ key: 'fiatTicker', value: fiatTicker })

  return {
    type: SET_FIAT_TICKER,
    fiatTicker
  }
}

export function getTickers() {
  return {
    type: GET_TICKERS
  }
}

export function recieveTickers({ btcTicker, ltcTicker }) {
  return {
    type: RECIEVE_TICKERS,
    btcTicker,
    ltcTicker
  }
}

export const fetchTicker = () => async dispatch => {
  dispatch(getTickers())
  const btcTicker = await requestTicker()
  dispatch(recieveTickers({ btcTicker }))
  return btcTicker
}

// Receive IPC event for receiveCryptocurrency
export const receiveCryptocurrency = (event, currency) => dispatch => {
  dispatch({ type: SET_CURRENCY, currency: cryptoTickers[currency] })
  dispatch({ type: SET_CRYPTO, crypto: cryptoTickers[currency] })
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
    ltcTicker
  })
}

// Selectors
const tickerSelectors = {}
const cryptoSelector = state => state.ticker.crypto
const currencySelector = state => state.ticker.currency
const currencyFiltersSelector = state => state.ticker.currencyFilters
const bitcoinTickerSelector = state => state.ticker.btcTicker
const litecoinTickerSelector = state => state.ticker.ltcTicker
const tickerLoadingSelector = state => state.ticker.tickerLoading

tickerSelectors.currency = currencySelector
tickerSelectors.tickerLoading = tickerLoadingSelector

tickerSelectors.currentTicker = createSelector(
  cryptoSelector,
  bitcoinTickerSelector,
  litecoinTickerSelector,
  (crypto, btcTicker, ltcTicker) => (crypto === 'btc' ? btcTicker : ltcTicker)
)

tickerSelectors.currencyFilters = createSelector(
  infoSelectors.networkSelector,
  currencyFiltersSelector,
  (network, currencyFilters = []) => {
    if (!network || !network.unitPrefix) {
      return currencyFilters
    }
    return currencyFilters.map(item => {
      item.name = `${network.unitPrefix}${item.name}`
      return item
    })
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

export { tickerSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  tickerLoading: false,
  currency: '',
  fromCurrency: 'sats',
  crypto: '',
  btcTicker: null,
  ltcTicker: null,
  fiatTicker: getDefaultCurrency(),
  fiatTickers: currencies,
  currencyFilters: [
    {
      key: 'btc',
      name: 'BTC'
    },
    {
      key: 'bits',
      name: 'bits'
    },
    {
      key: 'sats',
      name: 'satoshis'
    }
  ]
}

export default function tickerReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
