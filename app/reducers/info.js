import { ipcRenderer } from 'electron'
import get from 'lodash.get'
import db from 'store/db'
import { networks } from 'lib/utils/crypto'
import { walletAddress } from './address'
import { putWallet, walletSelectors } from './wallet'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_INFO = 'GET_INFO'
export const RECEIVE_INFO = 'RECEIVE_INFO'
export const SET_HAS_SYNCED = 'SET_HAS_SYNCED'

const networkInfo = {
  bitcoin: {
    mainnet: {
      id: 'mainnet',
      name: 'Mainnet',
      explorerUrl: 'https://blockstream.info',
      bitcoinJsNetwork: networks.bitcoin.mainnet,
      unitPrefix: ''
    },
    testnet: {
      id: 'testnet',
      name: 'Testnet',
      explorerUrl: 'https://blockstream.info/testnet',
      bitcoinJsNetwork: networks.bitcoin.testnet,
      unitPrefix: 't'
    }
  },
  litecoin: {
    mainnet: {
      id: 'mainnet',
      name: 'Mainnet',
      explorerUrl: 'https://insight.litecore.io',
      bitcoinJsNetwork: networks.litecoin.mainnet,
      unitPrefix: ''
    },
    testnet: {
      id: 'testnet',
      name: 'Testnet',
      explorerUrl: 'https://testnet.litecore.io',
      bitcoinJsNetwork: networks.litecoin.testnet,
      unitPrefix: 't'
    }
  }
}

// ------------------------------------
// Actions
// ------------------------------------
export function getInfo() {
  return {
    type: GET_INFO
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
export const receiveInfo = (event, data) => async (dispatch, getState) => {
  // Save the node info.
  dispatch({ type: RECEIVE_INFO, data })

  const state = getState()

  if (typeof state.info.hasSynced === 'undefined') {
    const node = await db.nodes.get({ id: data.identity_pubkey })
    const hasSynced = node ? node.hasSynced : false
    dispatch(setHasSynced(hasSynced))
  }

  // Now that we have the node info, get the current wallet address.
  dispatch(walletAddress('np2wkh'))

  // Update the active wallet settings with info discovered from getinfo.
  const wallet = walletSelectors.activeWalletSettings(state)
  const chain = get(data, 'chains[0]')
  const network = data.testnet ? 'testnet' : 'mainnet'
  if (wallet.chain !== chain || wallet.network !== network) {
    wallet.chain = chain
    wallet.network = network
    await dispatch(putWallet(wallet))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_HAS_SYNCED]: (state, { hasSynced }) => ({
    ...state,
    hasSynced
  }),
  [GET_INFO]: state => ({ ...state, infoLoading: true }),
  [RECEIVE_INFO]: (state, { data }) => {
    const chain = get(data, 'chains[0]')
    const network = data.testnet ? 'testnet' : 'mainnet'
    const networkData = get(networkInfo, `${chain}.${network}`)
    return {
      ...state,
      infoLoading: false,
      network: networkData,
      chain,
      data
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  infoLoading: false,
  hasSynced: undefined,
  network: {},
  data: {},
  chain: null
}

// Selectors
const infoSelectors = {}
infoSelectors.testnetSelector = state => state.info.data.testnet
infoSelectors.networkSelector = state => state.info.network
infoSelectors.infoLoading = state => state.info.infoLoading
infoSelectors.hasSynced = state => state.info.hasSynced

export { infoSelectors }

export default function infoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
