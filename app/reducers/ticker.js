import { createSelector } from 'reselect'
import Store from 'electron-store'
import { currencies, getCurrency } from 'lib/utils/i18n'
import { infoSelectors } from './info'
import { requestTickers } from '../lib/utils/api'

// Settings store
const store = new Store({ name: 'settings' })

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
  store.set('fiatTicker', fiatTicker)

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
  const tickers = await requestTickers(['bitcoin', 'litecoin'])
  dispatch(recieveTickers(tickers))

  return tickers
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
const currencyFiltersSelector = state => state.ticker.currencyFilters
const currencySelector = state => state.ticker.currency
const bitcoinTickerSelector = state => state.ticker.btcTicker
const litecoinTickerSelector = state => state.ticker.ltcTicker

tickerSelectors.currentTicker = createSelector(
  cryptoSelector,
  bitcoinTickerSelector,
  litecoinTickerSelector,
  (crypto, btcTicker, ltcTicker) => (crypto === 'btc' ? btcTicker : ltcTicker)
)

tickerSelectors.currentCurrencyFilters = createSelector(
  currencySelector,
  currencyFiltersSelector,
  (currency, filters) => filters.filter(f => f.key !== currency)
)

tickerSelectors.currencyName = createSelector(
  currencySelector,
  infoSelectors.networkSelector,
  (currency, network) => {
    let unit = currency
    if (currency === 'btc') {
      unit = 'BTC'
    }
    if (currency === 'sats') {
      unit = 'satoshis'
    }

    return `${network.unitPrefix}${unit}`
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
  fiatTicker: getCurrency(),
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
