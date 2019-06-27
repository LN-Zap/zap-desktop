import { createSelector } from 'reselect'
import get from 'lodash/get'
import { networks } from '@zap/utils/crypto'
import { grpcService } from 'workers'
import { initAddresses } from './address'
import { putWallet, walletSelectors } from './wallet'
import { settingsSelectors } from './settings'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_INFO = 'GET_INFO'
export const RECEIVE_INFO = 'RECEIVE_INFO'
export const SET_HAS_SYNCED = 'SET_HAS_SYNCED'

// ------------------------------------
// Actions
// ------------------------------------
export function getInfo() {
  return {
    type: GET_INFO,
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
  const grpc = await grpcService
  const info = await grpc.services.Lightning.getInfo()
  dispatch(receiveInfo(info))
}

export function setInfo(data) {
  return { type: RECEIVE_INFO, data }
}

// Receive IPC event for info
export const receiveInfo = data => async (dispatch, getState) => {
  // Save the node info.
  dispatch(setInfo(data))

  const state = getState()

  // Now that we have the node info, load it's sync state.
  const node = await window.db.nodes.get({ id: data.identity_pubkey })
  if (node) {
    dispatch(setHasSynced(node.hasSynced))
  }

  // Now that we have the node info, get the current wallet addresses.
  dispatch(initAddresses())

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
    hasSynced,
  }),
  [GET_INFO]: state => ({ ...state, infoLoading: true }),
  [RECEIVE_INFO]: (state, { data }) => {
    const chain = get(data, 'chains[0].chain')
    const network = get(data, 'chains[0].network')
    return {
      ...state,
      infoLoading: false,
      infoLoaded: true,
      chain,
      network,
      data,
    }
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
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
    },
    litecoin: {
      mainnet: {
        id: 'mainnet',
        name: 'Mainnet',
        explorerUrls: {
          blockstream: 'https://insight.litecore.io', // not supported, default to insight.
          blockcypher: 'https://live.blockcypher.com/ltc',
          smartbit: 'https://insight.litecore.io', // not supported, default to insight.
        },
        bitcoinJsNetwork: networks.litecoin.mainnet,
        unitPrefix: '',
      },
      testnet: {
        id: 'testnet',
        name: 'Testnet',
        explorerUrls: {
          blockstream: 'https://testnet.litecore.io', // not supported, default to insight.
          blockcypher: 'https://testnet.litecore.io', // not supported, default to insight.
          smartbit: 'https://testnet.litecore.io', // not supported, default to insight.
        },
        bitcoinJsNetwork: networks.litecoin.testnet,
        unitPrefix: 't',
      },
    },
  },
  chains: {
    bitcoin: {
      name: 'Bitcoin',
    },
    litecoin: {
      name: 'Litecoin',
    },
  },
}

// Selectors
const infoSelectors = {}
infoSelectors.chainSelector = state => state.info.chain
infoSelectors.chainsSelector = state => state.info.chains
infoSelectors.networkSelector = state => state.info.network
infoSelectors.networksSelector = state => state.info.networks
infoSelectors.infoLoading = state => state.info.infoLoading
infoSelectors.infoLoaded = state => state.info.infoLoaded
infoSelectors.hasSynced = state => state.info.hasSynced
infoSelectors.isSyncedToChain = state => get(state, 'info.data.synced_to_chain', false)
infoSelectors.version = state => get(state, 'info.data.version')
infoSelectors.identityPubkey = state => get(state, 'info.data.identity_pubkey')
infoSelectors.nodeUri = state => get(state, 'info.data.uris[0]')

// Extract the version string from the version.
infoSelectors.versionString = createSelector(
  infoSelectors.version,
  version => version && version.split(' ')[0]
)

// Extract the commit string from the version.
infoSelectors.commitString = createSelector(
  infoSelectors.version,
  version => {
    if (!version) {
      return
    }
    const commitString = version.split(' ')[1]
    return commitString ? commitString.replace('commit=', '') : undefined
  }
)

// Get the node pubkey. If not set, try to extract it from the node uri.
infoSelectors.nodePubkey = createSelector(
  infoSelectors.nodeUri,
  infoSelectors.identityPubkey,
  (nodeUri, identityPubkey) => {
    const parseFromDataUri = () => nodeUri && nodeUri.split('@')[0]
    return identityPubkey || parseFromDataUri()
  }
)

// Get the node uri or pubkey.
infoSelectors.nodeUriOrPubkey = createSelector(
  infoSelectors.nodeUri,
  infoSelectors.nodePubkey,
  (nodeUri, nodePubkey) => nodeUri || nodePubkey
)

infoSelectors.networkInfo = createSelector(
  infoSelectors.chainSelector,
  infoSelectors.networkSelector,
  infoSelectors.networksSelector,
  settingsSelectors.currentConfig,
  (chain, network, networks, currentConfig) => {
    const networkInfo = get(networks, `${chain}.${network}`, {})
    networkInfo.explorerUrl = networkInfo.explorerUrls[currentConfig.blockExplorer]
    return networkInfo
  }
)

infoSelectors.chainName = createSelector(
  infoSelectors.chainSelector,
  infoSelectors.chainsSelector,
  (chain, chains) => get(chains, `${chain}.name`, null)
)

export { infoSelectors }

export default function infoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
