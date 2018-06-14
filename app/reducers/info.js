import bitcoin from 'bitcoinjs-lib'

import { ipcRenderer } from 'electron'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_INFO = 'GET_INFO'
export const RECEIVE_INFO = 'RECEIVE_INFO'
export const SET_WALLET_CURRENCY_FILTERS = 'SET_WALLET_CURRENCY_FILTERS'

// ------------------------------------
// Actions
// ------------------------------------
export function getInfo() {
  return {
    type: GET_INFO
  }
}

export function setWalletCurrencyFilters(showWalletCurrencyFilters) {
  return {
    type: SET_WALLET_CURRENCY_FILTERS,
    showWalletCurrencyFilters
  }
}

// Send IPC event for getinfo
export const fetchInfo = () => async (dispatch) => {
  dispatch(getInfo())
  ipcRenderer.send('lnd', { msg: 'info' })
}

// Receive IPC event for info
export const receiveInfo = (event, data) => (dispatch) => {
  dispatch({ type: RECEIVE_INFO, data })
}

const networks = {
  testnet: {
    explorerUrl: 'https://testnet.smartbit.com.au',
    bitcoinJsNetwork: bitcoin.networks.testnet
  },
  mainnet: {
    explorerUrl: 'https://smartbit.com.au',
    bitcoinJsNetwork: bitcoin.networks.bitcoin
  }
}
// IPC info fetch failed
// export const infoFailed = (event, data) => dispatch => {}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_INFO]: state => ({ ...state, infoLoading: true }),
  [RECEIVE_INFO]: (state, { data }) => ({
    ...state,
    infoLoading: false,
    network: (data.testnet ? networks.testnet : networks.mainnet),
    data
  }),
  [SET_WALLET_CURRENCY_FILTERS]: (state, { showWalletCurrencyFilters }) => ({ ...state, showWalletCurrencyFilters })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  infoLoading: false,
  network: {},
  data: {},
  showWalletCurrencyFilters: false
}

// Selectors
const infoSelectors = {}
infoSelectors.testnetSelector = state => state.info.data.testnet
infoSelectors.networkSelector = state => state.info.network

export { infoSelectors }

export default function infoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
