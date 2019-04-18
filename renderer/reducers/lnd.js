import config from 'config'
import { createSelector } from 'reselect'
import { proxyValue } from 'comlinkjs'
import { grpcService } from 'workers'
import { fetchInfo } from './info'
import { startNeutrino, stopNeutrino } from './neutrino'
import { putWallet, setActiveWallet, walletSelectors } from './wallet'
import { fetchBalance } from './balance'
import { setSeed } from './onboarding'
import { receiveInvoiceData } from './invoice'
import { receiveChannelGraphData } from './channels'
import { receiveTransactionData } from './transaction'

// ------------------------------------
// Constants
// ------------------------------------

export const START_LND = 'START_LND'
export const START_LND_SUCCESS = 'START_LND_SUCCESS'
export const START_LND_FAILURE = 'START_LND_FAILURE'
export const CLEAR_START_LND_ERROR = 'CLEAR_START_LND_ERROR'

export const STOP_LND = 'STOP_LND'
export const STOP_LND_SUCCESS = 'STOP_LND_SUCCESS'

export const CREATE_NEW_WALLET = 'CREATE_NEW_WALLET'
export const CREATE_NEW_WALLET_SUCCESS = 'CREATE_NEW_WALLET_SUCCESS'

export const RECOVER_OLD_WALLET = 'RECOVER_OLD_WALLET'
export const RECOVER_OLD_WALLET_SUCCESS = 'RECOVER_OLD_WALLET_SUCCESS'

export const UNLOCK_WALLET = 'UNLOCK_WALLET'
export const UNLOCK_WALLET_SUCCESS = 'UNLOCK_WALLET_SUCCESS'
export const UNLOCK_WALLET_FAILURE = 'UNLOCK_WALLET_FAILURE'

export const FETCH_SEED = 'FETCH_SEED'
export const FETCH_SEED_SUCCESS = 'FETCH_SEED_SUCCESS'
export const FETCH_SEED_FAILURE = 'FETCH_SEED_FAILURE'

export const CONNECT_GRPC = 'CONNECT_GRPC'
export const CONNECT_GRPC_SUCCESS = 'CONNECT_GRPC_SUCCESS'
export const CONNECT_GRPC_FAILURE = 'CONNECT_GRPC_FAILURE'

export const START_WALLET_UNLOCKER_SUCCESS = 'START_WALLET_UNLOCKER_SUCCESS'
export const START_LIGHTNING_WALLET_SUCCESS = 'START_LIGHTNING_WALLET_SUCCESS'

export const DISCONNECT_GRPC = 'DISCONNECT_GRPC'
export const DISCONNECT_GRPC_SUCCESS = 'DISCONNECT_GRPC_SUCCESS'
export const DISCONNECT_GRPC_FAILURE = 'DISCONNECT_GRPC_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const initLnd = () => async dispatch => {
  const grpc = await grpcService

  // Hook up event listeners for stream subscriptions.
  grpc.on('subscribeInvoices.data', proxyValue(data => dispatch(receiveInvoiceData(data))))
  grpc.on('subscribeTransactions.data', proxyValue(data => dispatch(receiveTransactionData(data))))
  grpc.on('subscribeChannelGraph.data', proxyValue(data => dispatch(receiveChannelGraphData(data))))
}

/**
 * Connect to lnd gRPC service.
 */
export const connectGrpcService = () => async dispatch => {
  dispatch({ type: CONNECT_GRPC })
  try {
    const grpc = await grpcService
    if (await grpc.can('connect')) {
      await grpc.connect()
    }
    dispatch({ type: CONNECT_GRPC_SUCCESS })
  } catch (error) {
    dispatch({ type: CONNECT_GRPC_FAILURE, error })
  }
}

/**
 * Disconnect from lnd gRPC service.
 */
export const disconnectGrpcService = () => async dispatch => {
  dispatch({ type: DISCONNECT_GRPC })
  try {
    const grpc = await grpcService
    if (await grpc.can('disconnect')) {
      await grpc.disconnect()
    }
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
  const lndConfig = await dispatch(generateLndConfigFromWallet(wallet))

  // Tell the main process to start lnd using th  e supplied connection details.
  dispatch({ type: START_LND, lndConfig })

  try {
    // If we are working with a local wallet, start a local Neutrino instance first.
    if (lndConfig.type === 'local') {
      await dispatch(startNeutrino(lndConfig))
    }

    // Connect the gRPC services.
    const grpc = await grpcService
    await grpc.init(lndConfig)
    await dispatch(connectGrpcService())

    if (await grpc.is('locked')) {
      dispatch(walletUnlockerStarted())
    } else if (await grpc.is('active')) {
      dispatch(lightningGrpcStarted())
    }

    // Finalise the action.
    dispatch(lndStarted())
  } catch (e) {
    // If we are working with a local wallet, start a local Neutrino instance first.
    if (lndConfig.type === 'local') {
      await dispatch(stopNeutrino())
    }
    dispatch(startLndError({ host: e.message }))
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
  const {
    lnd: { isStoppingLnd, lndConfig },
  } = getState()

  if (!isStoppingLnd) {
    dispatch({ type: STOP_LND })
    await dispatch(disconnectGrpcService())

    if (lndConfig.type === 'local') {
      await dispatch(stopNeutrino())
    }

    dispatch(lndStopped())
  }
}

/**
 * Stop lnd success callback.
 *
 * Called when lnd+neutrino has fully stopped.
 */
export const lndStopped = () => async dispatch => {
  dispatch({ type: STOP_LND_SUCCESS })
}

/**
 * Lightning gRPC connect callback.
 *
 * Called when connection to Lightning gRPC interface has been established.
 * (lnd wallet is connected and unlocked)
 */
export const lightningGrpcStarted = () => async (dispatch, getState) => {
  dispatch({ type: START_LIGHTNING_WALLET_SUCCESS })

  // We are connected to the lightning interface, so the wallet must now be unlocked.
  dispatch(walletUnlocked())

  // Once we we have established a connection, save the wallet settings
  // after connection was successfully established. This is especially important
  // for the first connection to be sure settings are correct
  const { lndConfig } = getState().lnd
  if (lndConfig.id !== 'tmp') {
    const wallet = await dispatch(putWallet(lndConfig))
    await dispatch(setActiveWallet(wallet.id))
  }

  // Fetch key info from lnd as early as possible.
  dispatch(fetchInfo())
  dispatch(fetchBalance())
}

/**
 * WalletUnlocker connect gRPC callback.
 *
 * Called when connection to WalletUnlocker gRPC interface has been established.
 * (lnd is ready to unlock or create wallet)
 */
export const walletUnlockerStarted = () => {
  return {
    type: START_WALLET_UNLOCKER_SUCCESS,
  }
}

/**
 * Unlock wallet.
 */
export const unlockWallet = password => async dispatch => {
  dispatch({ type: UNLOCK_WALLET })
  try {
    const grpc = await grpcService
    await grpc.services.WalletUnlocker.unlockWallet(password)
    dispatch(walletUnlocked())
    dispatch(lightningGrpcStarted())
  } catch (e) {
    dispatch(setUnlockWalletError(e.message))
  }
}

/**
 * Unlock wallet success callback.
 */
export const walletUnlocked = () => async dispatch => {
  dispatch({ type: UNLOCK_WALLET_SUCCESS })
}

/**
 * Unlock wallet error callback.
 */
export const setUnlockWalletError = unlockWalletError => dispatch => {
  dispatch({ type: UNLOCK_WALLET_FAILURE, unlockWalletError })
}

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
    dispatch(fetchSeedError(error))
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
 * Create a new wallet.
 */
export const createNewWallet = () => async (dispatch, getState) => {
  dispatch({ type: CREATE_NEW_WALLET })
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
  await grpc.services.WalletUnlocker.initWallet({
    wallet_password: state.onboarding.password,
    cipher_seed_mnemonic: state.onboarding.seed,
    recovery_window: 0,
  })
  dispatch(walletCreated())
}

/**
 * Create new wallet success callback.
 */
export const walletCreated = () => dispatch => {
  dispatch({ type: CREATE_NEW_WALLET_SUCCESS })
}

/**
 * Recover an old wallet.
 */
export const recoverOldWallet = () => async (dispatch, getState) => {
  dispatch({ type: RECOVER_OLD_WALLET })
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
  await grpc.services.WalletUnlocker.initWallet({
    wallet_password: state.onboarding.password,
    cipher_seed_mnemonic: state.onboarding.seed,
    recovery_window: 2500,
  })
  dispatch(walletRecovered())
}

/**
 * Recover old wallet success callback.
 */
export const walletRecovered = () => dispatch => {
  dispatch({ type: RECOVER_OLD_WALLET_SUCCESS })
}

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
    fetchSeedError: '',
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
  [START_WALLET_UNLOCKER_SUCCESS]: state => ({
    ...state,
    isWalletUnlockerGrpcActive: true,
    isLightningGrpcActive: false,
  }),

  [START_LIGHTNING_WALLET_SUCCESS]: state => ({
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
  }),
  [STOP_LND_SUCCESS]: state => ({
    ...state,
    ...initialState,
  }),

  [CREATE_NEW_WALLET]: state => ({ ...state, isCreatingNewWallet: true }),
  [CREATE_NEW_WALLET_SUCCESS]: state => ({ ...state, isCreatingNewWallet: false }),

  [RECOVER_OLD_WALLET]: state => ({ ...state, isRecoveringOldWallet: true }),
  [RECOVER_OLD_WALLET_SUCCESS]: state => ({ ...state, isRecoveringOldWallet: false }),

  [UNLOCK_WALLET]: state => ({ ...state, isUnlockingWallet: true }),
  [UNLOCK_WALLET_SUCCESS]: state => ({
    ...state,
    isUnlockingWallet: false,
    isWalletUnlocked: true,
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
  isCreatingNewWallet: false,
  isRecoveringOldWallet: false,
  isStartingGrpc: false,
  isUnlockingWallet: false,
  isWalletUnlockerGrpcActive: false,
  isLightningGrpcActive: false,
  isWalletUnlocked: false,
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
