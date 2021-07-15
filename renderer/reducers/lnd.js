import { proxy } from 'comlink'
import config from 'config'
import { createSelector } from 'reselect'

import createReducer from '@zap/utils/createReducer'
import { grpc } from 'workers'

import { backupCurrentWallet, setupBackupService } from './backup'
import { fetchBalance } from './balance'
import { receiveChannelGraphData } from './channels'
import { fetchInfo, setInfo } from './info'
import { receiveInvoiceData } from './invoice'
import { startNeutrino, stopNeutrino } from './neutrino'
import { setSeed } from './onboarding'
import { receiveHtlcEventData } from './payment'
import { receiveTransactionData } from './transaction'
import { putWallet, removeWallet, setActiveWallet, walletSelectors } from './wallet'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isFetchingSeed: false,
  isStartingLnd: false,
  isStoppingLnd: false,
  isLndActive: false,
  isCreatingWallet: false,
  createWalletError: null,
  isStartingGrpc: false,
  isUnlockingWallet: false,
  isWalletUnlockerGrpcActive: false,
  isLightningGrpcActive: false,
  unlockWalletError: null,
  startLndError: null,
  stopLndError: null,
  fetchSeedError: null,
  lndConfig: {},
}

// ------------------------------------
// Constants
// ------------------------------------

export const START_LND = 'START_LND'
export const START_LND_SUCCESS = 'START_LND_SUCCESS'
export const START_LND_FAILURE = 'START_LND_FAILURE'
export const CLEAR_START_LND_ERROR = 'CLEAR_START_LND_ERROR'

export const STOP_LND = 'STOP_LND'
export const STOP_LND_SUCCESS = 'STOP_LND_SUCCESS'
export const STOP_LND_FAILURE = 'STOP_LND_FAILURE'

export const CREATE_WALLET = 'CREATE_WALLET'
export const CREATE_WALLET_SUCCESS = 'CREATE_WALLET_SUCCESS'
export const CREATE_WALLET_FAILURE = 'CREATE_WALLET_FAILURE'
export const CLEAR_CREATE_WALLET_ERROR = 'CLEAR_CREATE_WALLET_ERROR'

export const UNLOCK_WALLET = 'UNLOCK_WALLET'
export const UNLOCK_WALLET_SUCCESS = 'UNLOCK_WALLET_SUCCESS'
export const UNLOCK_WALLET_FAILURE = 'UNLOCK_WALLET_FAILURE'

export const FETCH_SEED = 'FETCH_SEED'
export const FETCH_SEED_SUCCESS = 'FETCH_SEED_SUCCESS'
export const FETCH_SEED_FAILURE = 'FETCH_SEED_FAILURE'

export const CONNECT_GRPC = 'CONNECT_GRPC'
export const CONNECT_GRPC_SUCCESS = 'CONNECT_GRPC_SUCCESS'
export const CONNECT_GRPC_FAILURE = 'CONNECT_GRPC_FAILURE'

export const LND_WALLET_UNLOCKER_GRPC_ACTIVE = 'LND_WALLET_UNLOCKER_GRPC_ACTIVE'
export const LND_LIGHTNING_GRPC_ACTIVE = 'LND_LIGHTNING_GRPC_ACTIVE'

export const LND_TOR_PROXY_STARTING = 'LND_TOR_PROXY_STARTING'
export const LND_TOR_PROXY_ACTIVE = 'LND_TOR_PROXY_ACTIVE'

export const DISCONNECT_GRPC = 'DISCONNECT_GRPC'
export const DISCONNECT_GRPC_SUCCESS = 'DISCONNECT_GRPC_SUCCESS'
export const DISCONNECT_GRPC_FAILURE = 'DISCONNECT_GRPC_FAILURE'

// ------------------------------------
// Helpers
// ------------------------------------

const handleLndStartError = (e, lndConfig) => {
  // Add more detail where we can.
  if (e.message === 'Failed to connect before the deadline') {
    e.message += `. Please ensure that lnd's gRPC interface is listening
    and contactable ${lndConfig && lndConfig.host && `at "${lndConfig.host}"`}
    and that your TLS certificate is valid for this host.`
  }

  // Error messages to help identify certain type of errors.
  const MACAROON_ERROR_MESSAGES = [
    'cannot determine data format of binary-encoded macaroon',
    'verification failed: signature mismatch after caveat verification',
    'unmarshal v2: section extends past end of buffer',
  ]

  // Try to figure out and categorize the error.
  const errors = {}
  if (e.code === 'LND_GRPC_HOST_ERROR') {
    errors.host = e.message
  }
  // There was a problem accessing the ssl cert.
  else if (e.code === 'LND_GRPC_CERT_ERROR') {
    errors.cert = e.message
  }
  // There was a problem accessing the macaroon file.
  else if (e.code === 'LND_GRPC_MACAROON_ERROR' || MACAROON_ERROR_MESSAGES.includes(e.message)) {
    errors.macaroon = e.message
  }
  // Other error codes most likely indicate that there is a problem with the host.
  else {
    errors.host = `Unable to connect to host: ${e.details || e.message}`
  }
  return errors
}

/**
 * unsubFromGrpcEvents - Unsubscribe from grpc events.
 *
 * @param {object} lndGrpc Lnd Grpc instance
 */
function unsubFromGrpcEvents(lndGrpc) {
  lndGrpc.removeAllListeners('subscribeHtlcEvents.data')
  lndGrpc.removeAllListeners('subscribeInvoices.data')
  lndGrpc.removeAllListeners('subscribeTransactions.data')
  lndGrpc.removeAllListeners('subscribeChannelGraph.data')
  lndGrpc.removeAllListeners('subscribeGetInfo.data')
  lndGrpc.removeAllListeners('subscribeChannelBackups.data')

  lndGrpc.removeAllListeners('GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE')
  lndGrpc.removeAllListeners('GRPC_LIGHTNING_SERVICE_ACTIVE')
  lndGrpc.removeAllListeners('GRPC_TOR_PROXY_STARTING')
  lndGrpc.removeAllListeners('GRPC_TOR_PROXY_ACTIVE')
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * connectGrpcService - Connect to lnd gRPC service.
 *
 * @param {object} lndConfig LndConfig object
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const connectGrpcService = lndConfig => async dispatch => {
  dispatch({ type: CONNECT_GRPC })

  const handleHtlcEventsSubscription = proxy(data => dispatch(receiveHtlcEventData(data)))
  const handleInvoiceSubscription = proxy(data => dispatch(receiveInvoiceData(data)))
  const handleGetInfoSubscription = proxy(data => dispatch(setInfo(data)))
  const handleTransactionSubscription = proxy(data => dispatch(receiveTransactionData(data)))
  const handleChannelGraphSubscription = proxy(data => dispatch(receiveChannelGraphData(data)))
  const handleBackupsSubscription = proxy(data => dispatch(backupCurrentWallet(lndConfig.id, data)))

  const handleWalletUnlockerActive = proxy(data => dispatch(setWalletUnlockerGrpcActive(data)))
  const handleLightningActive = proxy(data => dispatch(setLightningGrpcActive(data)))
  const handleTorProxyStarting = proxy(data => dispatch(setTorProxyStarting(data)))
  const handleTorProxyActive = proxy(data => dispatch(setTorProxyActive(data)))

  try {
    // Hook up event listeners for stream subscriptions.
    grpc.on('subscribeHtlcEvents.data', handleHtlcEventsSubscription)
    grpc.on('subscribeInvoices.data', handleInvoiceSubscription)
    grpc.on('subscribeTransactions.data', handleTransactionSubscription)
    grpc.on('subscribeChannelGraph.data', handleChannelGraphSubscription)
    grpc.on('subscribeChannelBackups.data', handleBackupsSubscription)
    grpc.on('subscribeGetInfo.data', handleGetInfoSubscription)

    // Hook up event listeners to notify when each gRPC service becomes available.
    grpc.on('GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE', handleWalletUnlockerActive)
    grpc.on('GRPC_LIGHTNING_SERVICE_ACTIVE', handleLightningActive)
    grpc.on('GRPC_TOR_PROXY_STARTING', handleTorProxyStarting)
    grpc.on('GRPC_TOR_PROXY_ACTIVE', handleTorProxyActive)

    await grpc.connect(lndConfig)

    dispatch({ type: CONNECT_GRPC_SUCCESS })
  } catch (error) {
    dispatch({ type: CONNECT_GRPC_FAILURE, error })
    // Disconnect event listeners.
    unsubFromGrpcEvents(grpc)
    // Rethrow the error so that callers of this method are able to handle errors themselves.
    throw error
  }
}

/**
 * disconnectGrpcService - Disconnect from lnd gRPC service.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const disconnectGrpcService = () => async dispatch => {
  dispatch({ type: DISCONNECT_GRPC })
  try {
    // Disconnect event listeners.
    unsubFromGrpcEvents(grpc)
    await grpc.disconnect()
    dispatch({ type: DISCONNECT_GRPC_SUCCESS })
  } catch (error) {
    dispatch({ type: DISCONNECT_GRPC_FAILURE, error })
  }
}

/**
 * startActiveWallet - Start the currently active wallet..
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const startActiveWallet = () => async (dispatch, getState) => {
  const state = getState()
  const { isLndActive, isStartingLnd, isStoppingLnd } = state.lnd

  if (!isLndActive && !isStartingLnd && !isStoppingLnd) {
    const activeWalletSettings = walletSelectors.activeWalletSettings(state)
    if (activeWalletSettings) {
      await dispatch(startLnd(activeWalletSettings))
    }
  }
}

/**
 * startLnd - Start lnd with the provided wallet config.
 *
 * @param {object} wallet Wallet config
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const startLnd = wallet => async dispatch => {
  let lndConfig
  try {
    lndConfig = await dispatch(generateLndConfigFromWallet(wallet))

    // Tell the main process to start lnd using the supplied connection details.
    dispatch({ type: START_LND, lndConfig })

    // If we are working with a local wallet, start a local Neutrino instance first.
    // This will return once the gRPC interface is available.
    if (lndConfig.type === 'local') {
      await dispatch(startNeutrino(lndConfig))
    }

    // Connect the gRPC service.
    await dispatch(connectGrpcService(lndConfig))

    return dispatch(lndStarted())
  } catch (e) {
    const errors = handleLndStartError(e, lndConfig)
    dispatch(startLndError(errors))
    await dispatch(stopLnd())
    return Promise.reject(e)
  }
}

/**
 * lndStarted - Start lnd success callback.
 * Called once an active connection to the currenrtly active gRPC interface has been established.
 *
 * @returns {Function} Thunk
 */
export const lndStarted = () => {
  return { type: START_LND_SUCCESS }
}

/**
 * startLndError - Start lnd error callback.
 *
 * Called if there was a problem trying to start and establish a gRPC connection to lnd.
 *
 * @param {object} errors Lnd start errors
 * @param {string} errors.host Host errors
 * @param {string} errors.cert Certificate errors
 * @param {string} errors.macaroon Macaroon errors
 * @returns {object} Action
 */
export const startLndError = errors => {
  return {
    type: START_LND_FAILURE,
    errors,
  }
}

/**
 * clearStartLndError - Clear all lnd start errors.
 *
 * @returns {object} Action
 */
export const clearStartLndError = () => {
  return {
    type: CLEAR_START_LND_ERROR,
  }
}

/**
 * stopLnd - Stop lnd.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const stopLnd = () => async (dispatch, getState) => {
  const { isStoppingLnd, lndConfig } = getState().lnd
  if (isStoppingLnd) {
    return
  }

  dispatch({ type: STOP_LND })

  try {
    // Disconnect from the gRPC service.
    await dispatch(disconnectGrpcService())

    // Stop the neutrino process.
    if (lndConfig.type === 'local') {
      await dispatch(stopNeutrino())
    }

    dispatch({ type: STOP_LND_SUCCESS })
  } catch (error) {
    dispatch({ type: STOP_LND_FAILURE, error })
  }
}

/**
 * setTorProxyStarting - Tor proxy starting callback.
 *
 * Called when grpc tor proxy is about to start.
 *
 * @returns {Function} Thunk
 */
export const setTorProxyStarting = () => ({
  type: LND_TOR_PROXY_STARTING,
})

/**
 * setTorProxyActive - Tor proxy active callback.
 *
 * Called when grpc tor proxy has started.
 *
 * @returns {Function} Thunk
 */
export const setTorProxyActive = () => ({
  type: LND_TOR_PROXY_ACTIVE,
})

/**
 * setLightningGrpcActive - Lightning gRPC connect callback.
 *
 * Called when connection to Lightning gRPC interface has been established.
 * (lnd wallet is connected and unlocked).
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const setLightningGrpcActive = () => async (dispatch, getState) => {
  // Fetch key info from lnd as early as possible.
  dispatch(fetchInfo())
  dispatch(fetchBalance())

  // Once we we have established a connection, save the wallet settings
  // after connection was successfully established. This is especially important
  // for the first connection to be sure settings are correct
  const { lndConfig } = getState().lnd
  let walletId = lndConfig.id
  // no wallet id means wallet is being connected to for the first time
  // use `putWallet` to update DB and obtain `id`
  if (!walletId) {
    ;({ id: walletId } = await dispatch(putWallet(lndConfig)))
  }

  await dispatch(setActiveWallet(walletId))

  dispatch({ type: LND_LIGHTNING_GRPC_ACTIVE })
}

/**
 * setWalletUnlockerGrpcActive - WalletUnlocker connect gRPC callback.
 *
 * Called when connection to WalletUnlocker gRPC interface has been established.
 * (lnd is ready to unlock or create wallet).
 *
 * @returns {Function} Thunk
 */
export const setWalletUnlockerGrpcActive = () => ({
  type: LND_WALLET_UNLOCKER_GRPC_ACTIVE,
})

/**
 * unlockWallet - WalletUnlocker connect gRPC callback.
 *
 * @param {string} password Password
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const unlockWallet = password => async dispatch => {
  dispatch({ type: UNLOCK_WALLET })
  try {
    await grpc.unlock(password)
    dispatch(walletUnlocked())
  } catch (error) {
    // Notify of wallet unlock failure.
    dispatch(setUnlockWalletError(error.message))
  }
}

/**
 * walletUnlocked - Unlock wallet success callback.
 *
 * @returns {object} Action
 */
export const walletUnlocked = () => ({
  type: UNLOCK_WALLET_SUCCESS,
})

/**
 * setUnlockWalletError - Unlock wallet error callback.
 *
 * @param {string} unlockWalletError Error message
 * @returns {object} Action
 */
export const setUnlockWalletError = unlockWalletError => ({
  type: UNLOCK_WALLET_FAILURE,
  unlockWalletError,
})

/**
 * fetchSeed - Generate a new seed
 *
 * Starts a temporary lnd process and calls it's genSeed method.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const fetchSeed = () => async dispatch => {
  dispatch({ type: FETCH_SEED })
  try {
    // Start a temporary Neutrino instance.
    const { chain: defaultChain, network: defaultNetwork } = config
    const wallet = {
      id: `tmp`,
      type: 'local',
      chain: defaultChain,
      network: defaultNetwork,
    }
    await dispatch(startLnd(wallet))

    // Call genSeed method.
    const data = await grpc.services.WalletUnlocker.genSeed()
    dispatch(fetchSeedSuccess(data.cipherSeedMnemonic))
  } catch (error) {
    dispatch(fetchSeedError(error.message))
  }
}

/**
 * fetchSeedSuccess - Fetch seed success callback.
 *
 * @param {Array} cipherSeedMnemonic Mnemonic seed
 * @returns {(dispatch:Function) => void} Thunk
 */
export const fetchSeedSuccess = cipherSeedMnemonic => dispatch => {
  dispatch({ type: FETCH_SEED_SUCCESS, seed: cipherSeedMnemonic })
  dispatch(setSeed(cipherSeedMnemonic))
  dispatch(stopLnd())
}

/**
 * signMessage - Sign a message with a node's private key.
 *
 * @param {string} message Message to sign
 * @returns {Function} Thunk
 */
export const signMessage = message => () => {
  return grpc.services.Lightning.signMessage({ msg: Buffer.from(message) })
}

/**
 * verifyMessage - Verify `signature` over the given `message`.
 *
 * @param {string} message Message to verify
 * @param {string} signature Signature
 * @returns {Function} Thunk
 */
export const verifyMessage = (message, signature) => () => {
  return grpc.services.Lightning.verifyMessage({
    msg: Buffer.from(message),
    signature,
  })
}

/**
 * fetchSeedError - Fetch seed error callback.
 *
 * @param {string} error Error message
 * @returns {(dispatch:Function) => void} Thunk
 */
export const fetchSeedError = error => dispatch => {
  dispatch({
    type: FETCH_SEED_FAILURE,
    error,
  })
  dispatch(stopLnd())
}

/**
 * createWallet - Create a new wallet using settings from the onboarding state.
 *
 * @param {object} options Options
 * @param {object} options.recover Boolean indicating weather this is a recovery
 * @returns {(dispatch:Function, getState:Function) => Promise<object>} Thunk
 */
export const createWallet = ({ recover } = {}) => async (dispatch, getState) => {
  dispatch({ type: CREATE_WALLET })

  try {
    const state = getState()
    const { chain: defaultChain, network: defaultNetwork } = config

    // Define the wallet config.
    let wallet = {
      type: 'local',
      chain: state.onboarding.chain || defaultChain,
      network: state.onboarding.network || defaultNetwork,
      autopilot: state.onboarding.autopilot,
      alias: state.onboarding.alias,
      name: state.onboarding.name,
    }

    // Save the wallet config.
    wallet = await dispatch(putWallet(wallet))

    // Start lnd with the provided wallet config.
    await dispatch(startLnd(wallet))

    // Call initWallet method.
    await grpc.initWallet({
      walletPassword: Buffer.from(state.onboarding.password),
      aezeedPassphrase: state.onboarding.passphrase
        ? Buffer.from(state.onboarding.passphrase)
        : null,
      cipherSeedMnemonic: state.onboarding.seed,
      recoveryWindow: recover ? config.lnd.recoveryWindow : 0,
    })

    // Notify of wallet recovery success.
    dispatch(createWalletSuccess())
    dispatch(setupBackupService(wallet.id, recover))
    return wallet
  } catch (error) {
    // Attempt to clean up from failure.
    try {
      const { lndConfig } = getState().lnd
      await dispatch(stopLnd())
      return await dispatch(removeWallet(lndConfig))
    } finally {
      // Notify of wallet recovery failure.
      dispatch(createWalletFailure(error.message))
    }
  }
}

/**
 * createWalletSuccess - Create new wallet success callback.
 *
 * @returns {object} Action
 */
export const createWalletSuccess = () => ({
  type: CREATE_WALLET_SUCCESS,
})

/**
 * createWalletFailure - Create new wallet error callback.
 *
 * @param {string} error Error message
 *
 * @returns {object} Action
 */
export const createWalletFailure = error => ({
  type: CREATE_WALLET_FAILURE,
  error,
})

/**
 * clearCreateWalletError - Clear wallet create error.
 *
 * @returns {object} Action
 */
export const clearCreateWalletError = () => ({
  type: CLEAR_CREATE_WALLET_ERROR,
})

/**
 * generateLndConfigFromWallet - Re-generates config that includes updated lndconnectUri and QR
 * host, cert and macaroon values.
 *
 * @param {object} wallet Wallet config
 * @returns {Function} Thunk
 */
export const generateLndConfigFromWallet = wallet => async () => {
  return window.Zap.generateLndConfigFromWallet(wallet)
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [FETCH_SEED]: state => {
    state.isFetchingSeed = true
  },
  [FETCH_SEED_SUCCESS]: state => {
    state.isFetchingSeed = false
    state.fetchSeedError = null
  },

  [FETCH_SEED_FAILURE]: (state, { error }) => {
    state.isFetchingSeed = false
    state.fetchSeedError = error
  },

  [START_LND]: (state, { lndConfig }) => {
    state.lndConfig = lndConfig
    state.isStartingLnd = true
  },

  [START_LND_SUCCESS]: state => {
    state.isStartingLnd = false
    state.isLndActive = true
  },

  [START_LND_FAILURE]: (state, { errors }) => {
    state.isStartingLnd = false
    state.startLndError = errors
  },

  [CLEAR_START_LND_ERROR]: state => {
    state.startLndError = null
  },

  [CONNECT_GRPC]: state => {
    state.isStartingGrpc = true
  },
  [CONNECT_GRPC_SUCCESS]: state => {
    state.isStartingGrpc = false
  },

  [LND_TOR_PROXY_STARTING]: state => {
    state.isTorProxyStarting = true
    state.isTorProxyActive = false
  },
  [LND_TOR_PROXY_ACTIVE]: state => {
    state.isTorProxyStarting = false
    state.isTorProxyActive = true
  },

  [LND_WALLET_UNLOCKER_GRPC_ACTIVE]: state => {
    state.isWalletUnlockerGrpcActive = true
    state.isLightningGrpcActive = false
  },

  [LND_LIGHTNING_GRPC_ACTIVE]: state => {
    state.isWalletUnlockerGrpcActive = false
    state.isLightningGrpcActive = true
  },
  [CONNECT_GRPC_FAILURE]: state => {
    state.isStartingGrpc = false
  },

  [DISCONNECT_GRPC]: state => {
    state.isStoppingGrpc = true
  },

  [DISCONNECT_GRPC_SUCCESS]: state => {
    state.isStoppingGrpc = false
    state.isLightningGrpcActive = false
    state.isWalletUnlockerGrpcActive = false
  },
  [DISCONNECT_GRPC_FAILURE]: state => {
    state.isStoppingGrpc = false
  },

  [STOP_LND]: state => {
    state.isStoppingLnd = true
    state.stopLndError = null
  },
  [STOP_LND_SUCCESS]: state => {
    state.isStoppingLnd = false
    state.isLndActive = false
    state.stopLndError = null
  },
  [STOP_LND_FAILURE]: (state, { error }) => {
    state.isStoppingLnd = false
    state.isLndActive = false
    state.stopLndError = error
  },

  [CREATE_WALLET]: state => {
    state.isCreatingWallet = true
    state.createWalletError = null
  },
  [CREATE_WALLET_SUCCESS]: state => {
    state.isCreatingWallet = false
    state.createWalletError = null
  },
  [CREATE_WALLET_FAILURE]: (state, { error }) => {
    state.isCreatingWallet = false
    state.createWalletError = error
  },
  [CLEAR_CREATE_WALLET_ERROR]: state => {
    state.createWalletError = null
  },

  [UNLOCK_WALLET]: state => {
    state.isUnlockingWallet = true
  },
  [UNLOCK_WALLET_SUCCESS]: state => {
    state.isUnlockingWallet = false
    state.unlockWalletError = null
  },
  [UNLOCK_WALLET_FAILURE]: (state, { unlockWalletError }) => {
    state.isUnlockingWallet = false
    state.unlockWalletError = unlockWalletError
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const lndSelectors = {}
const startLndErrorSelector = state => state.lnd.startLndError
const isStartingLndSelector = state => state.lnd.isStartingLnd
const isUnlockingWalletSelector = state => state.lnd.isUnlockingWallet

lndSelectors.startLndHostError = createSelector(startLndErrorSelector, error => {
  return error ? error.host : null
})
lndSelectors.startLndCertError = createSelector(startLndErrorSelector, error => {
  return error ? error.cert : null
})
lndSelectors.startLndMacaroonError = createSelector(startLndErrorSelector, error => {
  return error ? error.macaroon : null
})
lndSelectors.isStartingLnd = isStartingLndSelector
lndSelectors.isUnlockingWallet = isUnlockingWalletSelector

export { lndSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
