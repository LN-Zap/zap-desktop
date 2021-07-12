import get from 'lodash/get'

import createReducer from '@zap/utils/createReducer'
import { networks } from '@zap/utils/crypto'
import { initAddresses, addressSelectors } from 'reducers/address'
import { putWallet, walletSelectors } from 'reducers/wallet'
import { grpc } from 'workers'

import * as constants from './constants'

const { GET_INFO, RECEIVE_INFO, SET_HAS_SYNCED } = constants

/**
 * @typedef State
 * @property {boolean} infoLoading Boolean indicating if info is current loading
 * @property {boolean} infoLoaded Boolean indicating if info is loaded
 * @property {boolean|undefined} hasSynced Boolean indicating if node is synced
 * @property {string|null} chain Chain name
 * @property {string|null} network Network name
 * @property {object|null} data Node info (as returned from lnd)
 * @property {object} networks Details of supported networks
 * @property {object} chains Details of supported chains
 */

// ------------------------------------
// Initial State
// ------------------------------------

/** @type {State} */
const initialState = {
  infoLoading: false,
  infoLoaded: false,
  hasSynced: undefined,
  chain: null,
  network: null,
  data: {},
  networks: {
    bitcoin: {
      mainnet: {
        id: 'mainnet',
        name: 'Mainnet',
        explorerUrls: {
          blockstream: 'https://blockstream.info',
          blockcypher: 'https://live.blockcypher.com/btc',
          smartbit: 'https://www.smartbit.com.au',
        },
        bitcoinJsNetwork: networks.bitcoin.mainnet,
        unitPrefix: '',
      },
      testnet: {
        id: 'testnet',
        name: 'Testnet',
        explorerUrls: {
          blockstream: 'https://blockstream.info/testnet',
          blockcypher: 'https://live.blockcypher.com/btc-testnet',
          smartbit: 'https://testnet.smartbit.com.au',
        },
        bitcoinJsNetwork: networks.bitcoin.testnet,
        unitPrefix: 't',
      },
      regtest: {
        id: 'regtest',
        name: 'Regtest',
        explorerUrls: {
          blockstream: 'https://blockstream.info',
          blockcypher: 'https://live.blockcypher.com/btc',
          smartbit: 'https://www.smartbit.com.au',
        },
        bitcoinJsNetwork: networks.bitcoin.regtest,
        unitPrefix: 'r',
      },
      simnet: {
        id: 'simnet',
        name: 'Simnet',
        explorerUrls: {
          blockstream: 'https://blockstream.info',
          blockcypher: 'https://live.blockcypher.com/btc',
          smartbit: 'https://www.smartbit.com.au',
        },
        bitcoinJsNetwork: networks.bitcoin.simnet,
        unitPrefix: 's',
      },
    },
  },
  chains: {
    bitcoin: {
      name: 'Bitcoin',
    },
  },
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * getInfo - Initiate fetch of node info from lnd.
 *
 * @returns {object} Action
 */
export function getInfo() {
  return {
    type: GET_INFO,
  }
}

/**
 * setInfo - Set node info for the currently connected node.
 *
 * @param {object} data Node info
 * @returns {object} Action
 */
export function setInfo(data) {
  return { type: RECEIVE_INFO, data }
}

/**
 * setHasSynced - Register that the currently connected node has fully synced at least once.
 *
 * @param {boolean} hasSynced Boolean indicating the node has completed a full sync of the blockchain
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const setHasSynced = hasSynced => async (dispatch, getState) => {
  dispatch({ type: SET_HAS_SYNCED, hasSynced })

  const state = getState()
  const pubKey = get(state, 'info.data.identityPubkey')

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

/**
 * receiveInfo - Receive node info from lnd.
 *
 * @param {object} data Node info
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const receiveInfo = data => async (dispatch, getState) => {
  // Save the node info.
  dispatch(setInfo(data))

  const state = getState()

  // Now that we have the node info, load it's sync state.
  const node = await window.db.nodes.get({ id: data.identityPubkey })
  if (node) {
    dispatch(setHasSynced(node.hasSynced))
  }

  // Now that we have the node info, get the current wallet addresses.
  const currentAddresses = addressSelectors.currentAddresses(state)
  const hasAddresses = currentAddresses.np2wkh || currentAddresses.p2wkh
  if (!hasAddresses) {
    dispatch(initAddresses())
  }

  // Update the active wallet settings with info discovered from getinfo.
  const chain = get(state, 'info.chain')
  const network = get(state, 'info.network')

  const wallet = walletSelectors.activeWalletSettings(state)
  if (wallet && (wallet.chain !== chain || wallet.network !== network)) {
    const updatedWallet = {
      ...wallet,
      chain,
      network,
    }
    await dispatch(putWallet(updatedWallet))
  }
}

/**
 * fetchInfo - Fetch node info for the currently connected node.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const fetchInfo = () => async dispatch => {
  dispatch(getInfo())
  const info = await grpc.services.Lightning.getInfo()
  dispatch(receiveInfo(info))
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_HAS_SYNCED]: (state, { hasSynced }) => {
    state.hasSynced = hasSynced
  },
  [GET_INFO]: state => {
    state.infoLoading = true
  },
  [RECEIVE_INFO]: (state, { data }) => {
    state.infoLoading = false
    state.infoLoaded = true
    state.data = data
    state.chain = get(data, 'chains[0].chain')
    state.network = get(data, 'chains[0].network')
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
