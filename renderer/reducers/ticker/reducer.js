import { currencies, getDefaultCurrency } from '@zap/i18n'
import createReducer from '@zap/utils/createReducer'
import { requestTickerWithFallback } from '@zap/utils/rateProvider'
import { infoSelectors } from 'reducers/info'
import { putConfig, settingsSelectors } from 'reducers/settings'

import * as constants from './constants'
import tickerSelectors from './selectors'

const { GET_TICKERS, RECIEVE_TICKERS } = constants

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  tickerLoading: false,
  rates: null,
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
  },
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * fetchTickers - Fetch all fiat tickers from currently active fiat ticker provider.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const fetchTickers = () => async (dispatch, getState) => {
  const state = getState()
  const chain = 'BTC'
  const currentConfig = settingsSelectors.currentConfig(state)
  const currency = tickerSelectors.fiatTicker(state)
  dispatch({ type: GET_TICKERS })
  const rates = await requestTickerWithFallback(currentConfig.rateProvider, chain, currency)
  dispatch({ type: RECIEVE_TICKERS, rates })
}

/**
 * setFiatTicker - Set the currently active fiat ticker.
 *
 * @param {string} fiatTicker Fiat ticker symbol (USD, EUR etc)
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const setFiatTicker = fiatTicker => async dispatch => {
  await dispatch(putConfig('currency', fiatTicker))
  dispatch(fetchTickers())
}

/**
 * initCurrency - Initialise the fiat currency.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const initCurrency = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentCurrency = tickerSelectors.fiatTicker(state)

  if (currentConfig.currency !== currentCurrency) {
    await dispatch(setFiatTicker(currentConfig.currency))
  }
}

/**
 * initCurrency - Initialise the fiat tickers.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const initTickers = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentTicker = tickerSelectors.fiatTicker(state)

  if (currentConfig.currency !== currentTicker) {
    dispatch(setFiatTicker(currentConfig.currency))
  }

  await dispatch(fetchTickers())
}

/**
 * setCryptoUnit - Set the currently active crypto unit.
 *
 * @param {string} unit Crypto unit (eg bits, sats, btc)
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const setCryptoUnit = unit => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const chain = infoSelectors.chainSelector(state)
  const savedUnit = currentConfig.units[chain]
  if (unit !== savedUnit) {
    await dispatch(putConfig(`units.${chain}`, unit))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [GET_TICKERS]: state => {
    state.tickerLoading = true
  },
  [RECIEVE_TICKERS]: (state, { rates }) => {
    state.tickerLoading = false
    state.rates = rates
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
