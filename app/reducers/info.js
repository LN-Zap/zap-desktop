import Store from 'electron-store'
import bitcoin from 'bitcoinjs-lib'

import { ipcRenderer } from 'electron'
import { walletAddress } from './address'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_INFO = 'GET_INFO'
export const RECEIVE_INFO = 'RECEIVE_INFO'
export const SET_WALLET_CURRENCY_FILTERS = 'SET_WALLET_CURRENCY_FILTERS'
export const SET_HAS_SYNCED = 'SET_HAS_SYNCED'

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

export const setHasSynced = hasSynced => {
  return {
    type: SET_HAS_SYNCED,
    hasSynced
  }
}

// Send IPC event for getinfo
export const fetchInfo = () => async dispatch => {
  dispatch(getInfo())
  ipcRenderer.send('lnd', { msg: 'info' })
}

// Receive IPC event for info
export const receiveInfo = (event, data) => (dispatch, getState) => {
  dispatch({ type: RECEIVE_INFO, data })

  // Now that we have the node info, get the current wallet address.
  dispatch(walletAddress('np2wkh'))

  // Determine the node's current sync state.
  const state = getState()
  if (typeof state.info.hasSynced === 'undefined') {
    const store = new Store({ name: 'wallet' })
    const hasSynced = store.get(`${data.identity_pubkey}.hasSynced`, false)
    store.set(`${data.identity_pubkey}.hasSynced`, hasSynced)
    dispatch(setHasSynced(hasSynced))
  }
}

const networks = {
  testnet: {
    name: 'Testnet',
    explorerUrl: 'https://testnet.smartbit.com.au',
    bitcoinJsNetwork: bitcoin.networks.testnet,
    unitPrefix: 't'
  },
  mainnet: {
    name: null, // no name since it is the presumed default
    explorerUrl: 'https://smartbit.com.au',
    bitcoinJsNetwork: bitcoin.networks.bitcoin,
    unitPrefix: ''
  }
}
// IPC info fetch failed
// export const infoFailed = (event, data) => dispatch => {}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_HAS_SYNCED]: (state, { hasSynced }) => ({
    ...state,
    hasSynced
  }),
  [GET_INFO]: state => ({ ...state, infoLoading: true }),
  [RECEIVE_INFO]: (state, { data }) => ({
    ...state,
    infoLoading: false,
    network: data.testnet ? networks.testnet : networks.mainnet,
    data
  }),
  [SET_WALLET_CURRENCY_FILTERS]: (state, { showWalletCurrencyFilters }) => ({
    ...state,
    showWalletCurrencyFilters
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  infoLoading: false,
  hasSynced: undefined,
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
