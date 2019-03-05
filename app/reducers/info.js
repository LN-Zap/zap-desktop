import { createSelector } from 'reselect'
import { send } from 'redux-electron-ipc'
import get from 'lodash.get'
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

export const setHasSynced = hasSynced => async (dispatch, getState) => {
  dispatch({ type: SET_HAS_SYNCED, hasSynced })

  const state = getState()
  const pubKey = get(state, 'info.data.identity_pubkey')

  if (pubKey) {
    const updated = await window.db.nodes.update(pubKey, { hasSynced })
    if (updated === 0) {
      // The reason for a result of 0 can be either that the provided key was not found, or if the provided data was
      // identical to existing data so that nothing was updated. If we got a 0, try to add a new entry for the node.
      try {
        await window.db.nodes.add({ id: pubKey, hasSynced })
      } catch (e) {
        // Do nothing if there was an error - this indicates that the item already exists and was unchanged.
      }
    }
  }
}

// Send IPC event for getinfo
export const fetchInfo = () => async dispatch => {
  dispatch(getInfo())
  dispatch(send('lnd', { msg: 'info' }))
}

// Receive IPC event for info
export const receiveInfo = (event, data) => async (dispatch, getState) => {
  // Save the node info.
  dispatch({ type: RECEIVE_INFO, data })

  const state = getState()

  // Now that we have the node info, load it's sync state.
  const node = await window.db.nodes.get({ id: data.identity_pubkey })
  if (node) {
    dispatch(setHasSynced(node.hasSynced))
  }

  // Now that we have the node info, get the current wallet address.
  dispatch(walletAddress('np2wkh'))

  // Update the active wallet settings with info discovered from getinfo.
  const chain = get(state, 'info.chain')
  const network = get(state, 'info.network')

  const wallet = walletSelectors.activeWalletSettings(state)
  if (wallet && (wallet.chain !== chain || wallet.network !== network)) {
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
    const chain = get(data, 'chains[0].chain')
    const network = get(data, 'chains[0].network')
    return {
      ...state,
      infoLoading: false,
      chain,
      network,
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
  chain: null,
  network: null,
  data: {},
  networks: networkInfo
}

// Selectors
const infoSelectors = {}
infoSelectors.chainSelector = state => state.info.chain
infoSelectors.networkSelector = state => state.info.network
infoSelectors.networksSelector = state => state.info.networks
infoSelectors.infoLoading = state => state.info.infoLoading
infoSelectors.hasSynced = state => state.info.hasSynced

infoSelectors.networkInfo = createSelector(
  infoSelectors.chainSelector,
  infoSelectors.networkSelector,
  infoSelectors.networksSelector,
  (chain, network, networks) => get(networks, `${chain}.${network}`)
)

export { infoSelectors }

export default function infoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
