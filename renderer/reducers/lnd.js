import config from 'config'
import { createSelector } from 'reselect'
import { proxyValue } from 'comlinkjs'
import { grpcService } from 'workers'
import { fetchInfo } from './info'
import { startNeutrino, stopNeutrino } from './neutrino'
import { putWallet, removeWallet, setActiveWallet, walletSelectors } from './wallet'
import { fetchBalance } from './balance'
import { setSeed } from './onboarding'
import { receiveInvoiceData } from './invoice'
import { receiveChannelGraphData } from './channels'
import { receiveTransactionData } from './transaction'
import { backupCurrentWallet } from './backup'

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

export const DISCONNECT_GRPC = 'DISCONNECT_GRPC'
export const DISCONNECT_GRPC_SUCCESS = 'DISCONNECT_GRPC_SUCCESS'
export const DISCONNECT_GRPC_FAILURE = 'DISCONNECT_GRPC_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * Connect to lnd gRPC service.
 */
export const connectGrpcService = lndConfig => async dispatch => {
  dispatch({ type: CONNECT_GRPC })

  const grpc = await grpcService

  const handleInvoiceSubscription = proxyValue(data => dispatch(receiveInvoiceData(data)))
  const handleTransactionSubscription = proxyValue(data => dispatch(receiveTransactionData(data)))
  const handleChannelGraphSubscription = proxyValue(data => dispatch(receiveChannelGraphData(data)))
  const handleBackupsSubscription = proxyValue(data =>
    dispatch(backupCurrentWallet(lndConfig.id, data))
  )
  const handleWalletUnlockerActive = proxyValue(() => dispatch(setWalletUnlockerGrpcActive()))
  const handleLightningActive = proxyValue(() => dispatch(setLightningGrpcActive()))

  try {
    // Hook up event listeners for stream subscriptions.
    grpc.on('subscribeInvoices.data', handleInvoiceSubscription)
    grpc.on('subscribeTransactions.data', handleTransactionSubscription)
    grpc.on('subscribeChannelGraph.data', handleChannelGraphSubscription)
    grpc.on('subscribeChannelBackups.data', handleBackupsSubscription)

    // Hook up event listeners to notify when each gRPC service becomes available.
    grpc.on('GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE', handleWalletUnlockerActive)
    grpc.on('GRPC_LIGHTNING_SERVICE_ACTIVE', handleLightningActive)

    await grpc.connect(lndConfig)

    dispatch({ type: CONNECT_GRPC_SUCCESS })
  } catch (error) {
    dispatch({ type: CONNECT_GRPC_FAILURE, error })

    // Disconnect event listeners.
    grpc.off('subscribeInvoices.data', handleInvoiceSubscription)
    grpc.off('subscribeTransactions.data', handleTransactionSubscription)
    grpc.off('subscribeChannelGraph.data', handleChannelGraphSubscription)
    grpc.off('subscribeChannelBackups.data', handleBackupsSubscription)
    grpc.off('GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE', handleWalletUnlockerActive)
    grpc.off('GRPC_LIGHTNING_SERVICE_ACTIVE', handleLightningActive)

    // Rethrow the error so that callers of this method are able to handle errors themselves.
    throw error
  }
}

/**
 * Disconnect from lnd gRPC service.
 */
export const disconnectGrpcService = () => async dispatch => {
  dispatch({ type: DISCONNECT_GRPC })
  try {
    const grpc = await grpcService

    // Disconnect event listeners.
    grpc.removeAllListeners('subscribeInvoices.data')
    grpc.removeAllListeners('subscribeTransactions.data')
    grpc.removeAllListeners('subscribeChannelGraph.data')
    grpc.removeAllListeners('subscribeChannelBackups.data')
    grpc.removeAllListeners('GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE')
    grpc.removeAllListeners('GRPC_LIGHTNING_SERVICE_ACTIVE')

    await grpc.disconnect()

    dispatch({ type: DISCONNECT_GRPC_SUCCESS })
  } catch (error) {
    dispatch({ type: DISCONNECT_GRPC_FAILURE, error })
  }
}

/**
 * Start the currently active wallet.
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
 * Start lnd with the provided wallet config.
 * @param  {Object} wallet Wallet config
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

    dispatch(lndStarted())
  } catch (e) {
    const errors = handleLndStartError(e, lndConfig)
    dispatch(startLndError(errors))
    await dispatch(stopLnd())
    return Promise.reject(e)
  }
}

/**
 * Start lnd success callback.
 *
 * Called once an active connection to the currenrtly active gRPC interface has been established.
 */
export const lndStarted = () => {
  return { type: START_LND_SUCCESS }
}

/**
 * Start lnd error callback.
 *
 * Called if there was a problem trying to start and establish a gRPC connection to lnd.
 *
 * @param {Object} errors Lnd start errors
 * @param {String} errors.host Host errors
 * @param {String} errors.cert Certificate errors
 * @param {String} errors.macaroon Macaroon errors
 */
export const startLndError = errors => {
  return {
    type: START_LND_FAILURE,
    errors,
  }
}

/**
 * Clear all lnd start errors.
 */
export const clearStartLndError = () => {
  return {
    type: CLEAR_START_LND_ERROR,
  }
}

/**
 * Stop lnd.
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
 * Lightning gRPC connect callback.
 *
 * Called when connection to Lightning gRPC interface has been established.
 * (lnd wallet is connected and unlocked)
 */
export const setLightningGrpcActive = () => async (dispatch, getState) => {
  dispatch({ type: LND_LIGHTNING_GRPC_ACTIVE })

  // Fetch key info from lnd as early as possible.
  dispatch(fetchInfo())
  dispatch(fetchBalance())

  // Once we we have established a connection, save the wallet settings
  // after connection was successfully established. This is especially important
  // for the first connection to be sure settings are correct
  const { lndConfig } = getState().lnd
  await dispatch(setActiveWallet(lndConfig.id))
}

/**
 * WalletUnlocker connect gRPC callback.
 *
 * Called when connection to WalletUnlocker gRPC interface has been established.
 * (lnd is ready to unlock or create wallet)
 */
export const setWalletUnlockerGrpcActive = () => ({
  type: LND_WALLET_UNLOCKER_GRPC_ACTIVE,
})

/**
 * Unlock wallet.
 */
export const unlockWallet = password => async dispatch => {
  dispatch({ type: UNLOCK_WALLET })
  let waitForState
  try {
    const grpc = await grpcService
    waitForState = await grpc.waitForState('active')
    await grpc.services.WalletUnlocker.unlockWallet({ wallet_password: Buffer.from(password) })
    await waitForState.isDone
    dispatch(walletUnlocked())
  } catch (error) {
    // Remove Lightning gRPC activation listener.
    if (waitForState) {
      await waitForState.cancel()
    }
    // Notify of wallet unlock failure.
    dispatch(setUnlockWalletError(error.message))
  }
}

/**
 * Unlock wallet success callback.
 */
export const walletUnlocked = () => ({
  type: UNLOCK_WALLET_SUCCESS,
})

/**
 * Unlock wallet error callback.
 */
export const setUnlockWalletError = unlockWalletError => ({
  type: UNLOCK_WALLET_FAILURE,
  unlockWalletError,
})

/**
 * Generate a new seed
 *
 * Starts a temporary lnd process and calls it's genSeed method.
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
    const grpc = await grpcService
    const data = await grpc.services.WalletUnlocker.genSeed()
    dispatch(fetchSeedSuccess(data))
  } catch (error) {
    dispatch(fetchSeedError(error.message))
  }
}

/**
 * Fetch seed success callback.
 */
export const fetchSeedSuccess = ({ cipher_seed_mnemonic }) => dispatch => {
  dispatch({ type: FETCH_SEED_SUCCESS, seed: cipher_seed_mnemonic })
  dispatch(setSeed(cipher_seed_mnemonic))
  dispatch(stopLnd())
}

/**
 * Fetch seed error callback.
 */
export const fetchSeedError = error => dispatch => {
  dispatch({
    type: FETCH_SEED_FAILURE,
    error,
  })
  dispatch(stopLnd())
}

/**
 * Create a new wallet using settings from the onboarding state.
 * @param  {Object} options Options
 * @param  {Object} options.recover Boolean indicating weather this is a recovery
 * @return {Promise}
 */
export const createWallet = ({ recover } = {}) => async (dispatch, getState) => {
  dispatch({ type: CREATE_WALLET })

  let waitForState

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
    const grpc = await grpcService
    waitForState = await grpc.waitForState('active')

    await grpc.services.WalletUnlocker.initWallet({
      wallet_password: Buffer.from(state.onboarding.password),
      aezeed_passphrase: state.onboarding.passphrase
        ? Buffer.from(state.onboarding.passphrase)
        : null,
      cipher_seed_mnemonic: state.onboarding.seed,
      recovery_window: recover ? config.lnd.recoveryWindow : 0,
    })

    // Wait for the lightning gRPC interface to become active.
    await waitForState.isDone

    // Notify of wallet recovery success.
    dispatch(createWalletSuccess())
    return wallet
  } catch (error) {
    // Attempt to clean up from failure.
    try {
      const { lndConfig } = getState().lnd
      await dispatch(stopLnd())
      await dispatch(removeWallet(lndConfig))
    } finally {
      // Remove Lightning gRPC activation listener.
      if (waitForState) {
        await waitForState.cancel()
      }
      // Notify of wallet recovery failure.
      dispatch(createWalletFailure(error.message))
    }
  }
}

/**
 * Create new wallet success callback.
 */
export const createWalletSuccess = () => ({
  type: CREATE_WALLET_SUCCESS,
})

/**
 * Create new wallet success callback.
 */
export const createWalletFailure = error => ({
  type: CREATE_WALLET_FAILURE,
  error,
})

/**
 * Clear wallet create error.
 */
export const clearCreateWalletError = () => ({
  type: CLEAR_CREATE_WALLET_ERROR,
})

/**
 * Re-generates config that includes updated lndconnectUri and QR
 * host, cert and macaroon values
 */
export const generateLndConfigFromWallet = wallet => async () => {
  return await window.Zap.generateLndConfigFromWallet(wallet)
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [FETCH_SEED]: state => ({ ...state, isFetchingSeed: true }),
  [FETCH_SEED_SUCCESS]: state => ({
    ...state,
    isFetchingSeed: false,
    fetchSeedError: null,
  }),
  [FETCH_SEED_FAILURE]: (state, { error }) => ({
    ...state,
    isFetchingSeed: false,
    fetchSeedError: error,
  }),

  [START_LND]: (state, { lndConfig }) => ({
    ...state,
    lndConfig,
    isStartingLnd: true,
  }),
  [START_LND_SUCCESS]: state => ({
    ...state,
    isStartingLnd: false,
    isLndActive: true,
  }),
  [START_LND_FAILURE]: (state, { errors }) => ({
    ...state,
    isStartingLnd: false,
    startLndError: errors,
  }),
  [CLEAR_START_LND_ERROR]: state => ({
    ...state,
    startLndError: null,
  }),

  [CONNECT_GRPC]: state => ({
    ...state,
    isStartingGrpc: true,
  }),
  [CONNECT_GRPC_SUCCESS]: state => ({
    ...state,
    isStartingGrpc: false,
  }),
  [LND_WALLET_UNLOCKER_GRPC_ACTIVE]: state => ({
    ...state,
    isWalletUnlockerGrpcActive: true,
    isLightningGrpcActive: false,
  }),

  [LND_LIGHTNING_GRPC_ACTIVE]: state => ({
    ...state,
    isWalletUnlockerGrpcActive: false,
    isLightningGrpcActive: true,
  }),
  [CONNECT_GRPC_FAILURE]: state => ({
    ...state,
    isStartingGrpc: false,
  }),

  [DISCONNECT_GRPC]: state => ({
    ...state,
    isStoppingGrpc: true,
  }),

  [DISCONNECT_GRPC_SUCCESS]: state => ({
    ...state,
    isStoppingGrpc: false,
    isLightningGrpcActive: false,
    isWalletUnlockerGrpcActive: false,
  }),
  [DISCONNECT_GRPC_FAILURE]: state => ({
    ...state,
    isStoppingGrpc: false,
  }),

  [STOP_LND]: state => ({
    ...state,
    isStoppingLnd: true,
    stopLndError: null,
  }),
  [STOP_LND_SUCCESS]: state => ({
    ...state,
    isStoppingLnd: false,
    isLndActive: false,
    stopLndError: null,
  }),
  [STOP_LND_FAILURE]: (state, { error }) => ({
    ...state,
    isStoppingLnd: false,
    isLndActive: false,
    stopLndError: error,
  }),

  [CREATE_WALLET]: state => ({
    ...state,
    isCreatingWallet: true,
    createWalletError: null,
  }),
  [CREATE_WALLET_SUCCESS]: state => ({
    ...state,
    isCreatingWallet: false,
    createWalletError: null,
  }),
  [CREATE_WALLET_FAILURE]: (state, { error }) => ({
    ...state,
    isCreatingWallet: false,
    createWalletError: error,
  }),
  [CLEAR_CREATE_WALLET_ERROR]: state => ({
    ...state,
    createWalletError: null,
  }),

  [UNLOCK_WALLET]: state => ({ ...state, isUnlockingWallet: true }),
  [UNLOCK_WALLET_SUCCESS]: state => ({
    ...state,
    isUnlockingWallet: false,
    unlockWalletError: null,
  }),
  [UNLOCK_WALLET_FAILURE]: (state, { unlockWalletError }) => ({
    ...state,
    isUnlockingWallet: false,
    unlockWalletError,
  }),
}

// ------------------------------------
// Reducer
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
  fetchSeedError: null,
  lndConfig: {},
}

// ------------------------------------
// Selectors
// ------------------------------------
const lndSelectors = {}
const startLndErrorSelector = state => state.lnd.startLndError
const isStartingLndSelector = state => state.lnd.isStartingLnd

lndSelectors.startLndHostError = createSelector(
  startLndErrorSelector,
  startLndError => (startLndError ? startLndError.host : null)
)
lndSelectors.startLndCertError = createSelector(
  startLndErrorSelector,
  startLndError => (startLndError ? startLndError.cert : null)
)
lndSelectors.startLndMacaroonError = createSelector(
  startLndErrorSelector,
  startLndError => (startLndError ? startLndError.macaroon : null)
)
lndSelectors.isStartingLnd = isStartingLndSelector

export { lndSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
//
export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
