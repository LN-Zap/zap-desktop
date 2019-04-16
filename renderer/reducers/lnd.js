import config from 'config'
import { createSelector } from 'reselect'
import { lightningService, walletUnlockerService } from 'workers'
import { fetchInfo } from './info'
import { startNeutrino, stopNeutrino } from './neutrino'
import { putWallet, setActiveWallet, walletSelectors } from './wallet'
import { fetchBalance } from './balance'
import { setSeed } from './onboarding'

const LND_METHOD_UNAVAILABLE = 12

// ------------------------------------
// Constants
// ------------------------------------

export const START_LND = 'START_LND'
export const START_LND_SUCCESS = 'START_LND_SUCCESS'
export const START_LND_FAILURE = 'START_LND_FAILURE'
export const CLEAR_START_LND_ERROR = 'CLEAR_START_LND_ERROR'

export const STOP_LND = 'STOP_LND'
export const STOP_LND_SUCCESS = 'STOP_LND_SUCCESS'

export const START_WALLET_UNLOCKER = 'START_WALLET_UNLOCKER'
export const START_WALLET_UNLOCKER_SUCCESS = 'START_WALLET_UNLOCKER_SUCCESS'
export const START_WALLET_UNLOCKER_FAILURE = 'START_WALLET_UNLOCKER_FAILURE'
export const DISCONNECT_WALLET_UNLOCKER = 'DISCONNECT_WALLET_UNLOCKER'

export const START_LIGHTNING_WALLET = 'START_LIGHTNING_WALLET'
export const START_LIGHTNING_WALLET_SUCCESS = 'START_LIGHTNING_WALLET_SUCCESS'
export const START_LIGHTNING_WALLET_FAILURE = 'START_LIGHTNING_WALLET_FAILURE'
export const DISCONNECT_LIGHTNING_WALLET = 'DISCONNECT_LIGHTNING_WALLET'

export const CREATE_NEW_WALLET = 'CREATE_NEW_WALLET'
export const CREATE_NEW_WALLET_SUCCESS = 'CREATE_NEW_WALLET_SUCCESS'

export const RECOVER_OLD_WALLET = 'RECOVER_OLD_WALLET'
export const RECOVER_OLD_WALLET_SUCCESS = 'RECOVER_OLD_WALLET_SUCCESS'

export const UNLOCKING_WALLET = 'UNLOCKING_WALLET'
export const UNLOCK_WALLET_SUCCESS = 'UNLOCK_WALLET_SUCCESS'
export const UNLOCK_WALLET_FAILURE = 'UNLOCK_WALLET_FAILURE'

export const FETCH_SEED = 'FETCH_SEED'
export const FETCH_SEED_ERROR = 'FETCH_SEED_ERROR'
export const FETCH_SEED_SUCCESS = 'FETCH_SEED_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------

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
export const startLnd = wallet => async (dispatch, getState) => {
  const lndConfig = await dispatch(generateLndConfigFromWallet(wallet))

  // Tell the main process to start lnd using th  e supplied connection details.
  dispatch({ type: START_LND, lndConfig })

  return new Promise(async (resolve, reject) => {
    try {
      // If we are working with a local wallet, start a local Neutrino instance first.
      if (lndConfig.type === 'local') {
        await dispatch(startNeutrino(lndConfig))
      }

      // Try to connect to the Lightning interface.
      try {
        const { grpcActiveInterface } = getState().neutrino

        // Skip this step if we know upfront that the wallet unlocker interface is active.
        if (grpcActiveInterface === 'walletUnlocker') {
          const error = new Error('WalletUnlocker is active')
          error.code = LND_METHOD_UNAVAILABLE
          throw error
        }

        // Try to connect to the Lightning interface.
        await dispatch(startLightningWallet())
        dispatch(lndStarted())
        resolve()
      } catch (e) {
        // If the Lightning was unavailable, try connecting to the WalletUnlocker interface.
        if (e.code === LND_METHOD_UNAVAILABLE) {
          try {
            await dispatch(startWalletUnlocker())
            dispatch(lndStarted())
            return resolve()
          } catch (e) {
            throw e
          }
        }
        throw e
      }
    } catch (e) {
      dispatch(startLndError({ host: e.message }))
      reject(e)
    }
  })
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
 * Disconnect from WalletUnlocker gRPC interface.
 */
export const disconnectWalletUnlocker = () => async (dispatch, getState) => {
  const { isStartingWalletUnlocker, isWalletUnlockerGrpcActive } = getState().lnd
  if (isStartingWalletUnlocker || isWalletUnlockerGrpcActive) {
    dispatch({ type: DISCONNECT_WALLET_UNLOCKER })
    const walletUnlocker = await walletUnlockerService
    if (await walletUnlocker.can('disconnect')) {
      await walletUnlocker.disconnect()
    }
  }
}

/**
 * Disconnect from Lightning gRPC interface.
 */
export const disconnectLightningWallet = () => async (dispatch, getState) => {
  const { isStartingLightningWallet, isLightningGrpcActive } = getState().lnd
  if (isStartingLightningWallet || isLightningGrpcActive) {
    dispatch({ type: DISCONNECT_LIGHTNING_WALLET })
    const lightning = await lightningService
    if (await lightning.can('disconnect')) {
      await lightning.disconnect()
    }
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
    await dispatch(disconnectWalletUnlocker())
    await dispatch(disconnectLightningWallet())
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
 * Connect to the Lightning gRPC service.
 */
export const startLightningWallet = () => async (dispatch, getState) => {
  dispatch({ type: START_LIGHTNING_WALLET })
  const { lndConfig } = getState().lnd
  try {
    const lightning = await lightningService
    await lightning.init(lndConfig)
    await lightning.connect()
    dispatch(lightningGrpcStarted())
  } catch (error) {
    dispatch({ type: START_LIGHTNING_WALLET_FAILURE, error })
    throw error
  }
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
 * Connect to the WalletUnlocker gRPC service.
 */
export const startWalletUnlocker = () => async (dispatch, getState) => {
  dispatch({ type: START_WALLET_UNLOCKER })
  const { lndConfig } = getState().lnd
  try {
    const walletUnlocker = await walletUnlockerService
    await walletUnlocker.init(lndConfig)
    await walletUnlocker.connect()
    dispatch(walletUnlockerStarted())
  } catch (error) {
    dispatch({ type: START_WALLET_UNLOCKER_FAILURE, error })
    throw error
  }
}

/**
 * WalletUnlocker connect gRPC callback.
 *
 * Called when connection to WalletUnlocker gRPC interface has been established.
 * (lnd is ready to unlock or create wallet)
 */
export const walletUnlockerStarted = () => async (dispatch, getState) => {
  dispatch({ type: START_WALLET_UNLOCKER_SUCCESS })

  // If the lightning interface was previously active, disconnect it.
  const { isLightningGrpcActive } = getState().lnd
  if (isLightningGrpcActive) {
    dispatch(disconnectLightningWallet())
  }
}

/**
 * Unlock wallet.
 */
export const unlockWallet = password => async dispatch => {
  dispatch({ type: UNLOCKING_WALLET })
  try {
    const walletUnlocker = await walletUnlockerService
    await walletUnlocker.unlockWallet(password)
    dispatch(startLightningWallet())
  } catch (e) {
    dispatch(setUnlockWalletError(e.message))
  }
}

/**
 * Unlock wallet success callback.
 */
export const walletUnlocked = () => async dispatch => {
  dispatch({ type: UNLOCK_WALLET_SUCCESS })
  dispatch(disconnectWalletUnlocker())
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
    const walletUnlocker = await walletUnlockerService
    const data = await walletUnlocker.genSeed()
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
    type: FETCH_SEED_ERROR,
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
  const walletUnlocker = await walletUnlockerService
  await walletUnlocker.initWallet({
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
  dispatch(startLightningWallet())
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
  const walletUnlocker = await walletUnlockerService
  await walletUnlocker.initWallet({
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
  dispatch(startLightningWallet())
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
  [FETCH_SEED_ERROR]: (state, { error }) => ({
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

  [START_WALLET_UNLOCKER]: state => ({
    ...state,
    isStartingWalletUnlocker: true,
  }),
  [START_WALLET_UNLOCKER_SUCCESS]: state => ({
    ...state,
    isStartingWalletUnlocker: false,
    isWalletUnlockerGrpcActive: true,
  }),
  [START_WALLET_UNLOCKER_FAILURE]: state => ({
    ...state,
    isStartingLnd: false,
    isStartingWalletUnlocker: false,
    isWalletUnlockerGrpcActive: false,
  }),
  [DISCONNECT_WALLET_UNLOCKER]: state => ({
    ...state,
    isWalletUnlockerGrpcActive: false,
  }),

  [START_LIGHTNING_WALLET]: state => ({
    ...state,
    isStartingLightningWallet: true,
  }),
  [START_LIGHTNING_WALLET_SUCCESS]: state => ({
    ...state,
    isStartingLightningWallet: false,
    isLightningGrpcActive: true,
  }),
  [START_LIGHTNING_WALLET_FAILURE]: state => ({
    ...state,
    isStartingLnd: false,
    isStartingLightningWallet: false,
    isLightningGrpcActive: false,
  }),
  [DISCONNECT_LIGHTNING_WALLET]: state => ({
    ...state,
    isLightningGrpcActive: false,
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

  [UNLOCKING_WALLET]: state => ({ ...state, isUnlockingWallet: true }),
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
  isStartingWalletUnlocker: false,
  isStartingLightningWallet: false,
  isLndActive: false,
  isCreatingNewWallet: false,
  isRecoveringOldWallet: false,
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
const isStartingUnlockerSelector = state => state.lnd.isStartingWalletUnlocker

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
lndSelectors.isStartingUnlocker = isStartingUnlockerSelector

export { lndSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
//
export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
