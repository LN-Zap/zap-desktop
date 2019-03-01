import { send } from 'redux-electron-ipc'
import { createSelector } from 'reselect'
import { showSystemNotification } from 'lib/utils/notifications'
import { fetchBalance } from './balance'
import { fetchInfo, setHasSynced } from './info'
import { putWallet, setActiveWallet, walletSelectors } from './wallet'
import { onboardingFinished, setSeed } from './onboarding'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_SYNC_STATUS_PENDING = 'SET_SYNC_STATUS_PENDING'
export const SET_SYNC_STATUS_WAITING = 'SET_SYNC_STATUS_WAITING'
export const SET_SYNC_STATUS_IN_PROGRESS = 'SET_SYNC_STATUS_IN_PROGRESS'
export const SET_SYNC_STATUS_COMPLETE = 'SET_SYNC_STATUS_COMPLETE'

export const RECEIVE_CURRENT_BLOCK_HEIGHT = 'RECEIVE_CURRENT_BLOCK_HEIGHT'
export const RECEIVE_LND_BLOCK_HEIGHT = 'RECEIVE_LND_BLOCK_HEIGHT'
export const RECEIVE_LND_CFILTER_HEIGHT = 'RECEIVE_LND_CFILTER_HEIGHT'

export const SET_WALLET_UNLOCKER_ACTIVE = 'SET_WALLET_UNLOCKER_ACTIVE'
export const SET_LIGHTNING_WALLET_ACTIVE = 'SET_LIGHTNING_WALLET_ACTIVE'

export const STARTING_LND = 'STARTING_LND'
export const LND_STARTED = 'LND_STARTED'
export const SET_START_LND_ERROR = 'SET_START_LND_ERROR'

export const STOPPING_LND = 'STOPPING_LND'
export const LND_STOPPED = 'LND_STOPPED'

export const CREATING_NEW_WALLET = 'CREATING_NEW_WALLET'
export const RECOVERING_OLD_WALLET = 'RECOVERING_OLD_WALLET'

export const UNLOCKING_WALLET = 'UNLOCKING_WALLET'
export const WALLET_UNLOCKED = 'WALLET_UNLOCKED'
export const SET_UNLOCK_WALLET_ERROR = 'SET_UNLOCK_WALLET_ERROR'

export const FETCH_SEED = 'FETCH_SEED'
export const FETCH_SEED_ERROR = 'FETCH_SEED_ERROR'
export const FETCH_SEED_SUCCESS = 'FETCH_SEED_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------

// Receive IPC event for LND sync status change.
export const lndSyncStatus = (event, status) => async dispatch => {
  const notifTitle = 'Lightning Node Synced'
  const notifBody = "Visa who? You're your own payment processor now!"

  switch (status) {
    case 'waiting':
      dispatch({ type: SET_SYNC_STATUS_WAITING })
      break
    case 'in-progress':
      dispatch({ type: SET_SYNC_STATUS_IN_PROGRESS })
      break
    case 'complete':
      dispatch({ type: SET_SYNC_STATUS_COMPLETE })

      // Fetch data now that we know LND is synced
      dispatch(fetchBalance())
      dispatch(fetchInfo())

      // Persist the fact that the wallet has been synced at least once.
      dispatch(setHasSynced(true))

      // HTML 5 desktop notification for the new transaction
      showSystemNotification(notifTitle, notifBody)
      break
    default:
      dispatch({ type: SET_SYNC_STATUS_PENDING })
  }
}

// Connected to Lightning gRPC interface (lnd wallet is connected and unlocked)
export const lightningGrpcActive = (event, lndConfig) => async dispatch => {
  dispatch({ type: SET_LIGHTNING_WALLET_ACTIVE })
  // Once we we have established a connection, save the wallet settings
  // after connection was successfully established. This is especially important
  // for the first connection to be sure settings are correct
  if (lndConfig.id !== 'tmp') {
    const wallet = await dispatch(putWallet(lndConfig))
    await dispatch(setActiveWallet(wallet.id))
  }

  // Fetch info from lnd.
  dispatch(fetchInfo())

  // Let the onboarding process know that the wallet has started.
  dispatch(onboardingFinished())
}

// Connected to WalletUnlocker gRPC interface (lnd is ready to unlock or create wallet)
export const walletUnlockerGrpcActive = () => async dispatch => {
  dispatch({ type: SET_WALLET_UNLOCKER_ACTIVE })

  // Let the onboarding process know that the wallet unlocker has started.
  dispatch(lndWalletUnlockerStarted())
}

// Receive IPC event for current height.
export const currentBlockHeight = (event, height) => dispatch => {
  dispatch({ type: RECEIVE_CURRENT_BLOCK_HEIGHT, blockHeight: height })
}

// Receive IPC event for LND block height.
export const lndBlockHeight = (event, height) => dispatch => {
  dispatch({ type: RECEIVE_LND_BLOCK_HEIGHT, lndBlockHeight: height })
}

// Receive IPC event for LND cfilter height.
export const lndCfilterHeight = (event, height) => dispatch => {
  dispatch({ type: RECEIVE_LND_CFILTER_HEIGHT, lndCfilterHeight: height })
}

export const startLnd = options => async (dispatch, getState) => {
  const state = getState().lnd
  if (
    state.walletUnlockerGrpcActive ||
    state.lightningGrpcActive ||
    state.startingLnd ||
    state.stoppingLnd
  ) {
    return
  }
  return new Promise((resolve, reject) => {
    // Tell the main process to start lnd using the supplied connection details.
    dispatch({ type: STARTING_LND })
    dispatch(send('startLnd', options))

    window.ipcRenderer.once('startLndError', (event, error) => {
      window.ipcRenderer.removeListener('startLndSuccess', resolve)
      reject(error)
    })

    window.ipcRenderer.once('startLndSuccess', () => {
      window.ipcRenderer.removeListener('startLndError', reject)
      resolve()
    })
  })
}

// Listener for errors connecting to LND gRPC
export const startLndError = (event, errors) => dispatch => {
  dispatch(setStartLndError(errors))
}

export function setStartLndError(errors) {
  return {
    type: SET_START_LND_ERROR,
    errors
  }
}

export const stopLnd = () => async (dispatch, getState) => {
  const state = getState().lnd
  if ((state.walletUnlockerGrpcActive || state.lightningGrpcActive) && !state.stoppingLnd) {
    dispatch({ type: STOPPING_LND })
    dispatch(send('stopLnd'))
  }
}

export const lndStopped = () => async dispatch => {
  dispatch({ type: LND_STOPPED })
}

export const lndStarted = () => async dispatch => {
  dispatch({ type: LND_STARTED })
}

export const unlockWallet = password => async dispatch => {
  dispatch({ type: UNLOCKING_WALLET })
  dispatch(
    send('walletUnlocker', {
      msg: 'unlockWallet',
      data: { wallet_password: password }
    })
  )
}

/**
 * As soon as we have an active connection to a WalletUnlocker service, attempt to generate a new seed which kicks off
 * the process of creating or unlocking a wallet.
 */
export const lndWalletUnlockerStarted = () => (dispatch, getState) => {
  const state = getState()

  // Handle generate seed.
  if (state.lnd.fetchingSeed) {
    dispatch(send('walletUnlocker', { msg: 'genSeed' }))
  }

  // Handle unlock wallet.
  else if (state.lnd.unlockingWallet) {
    dispatch(
      send('walletUnlocker', {
        msg: 'unlockWallet',
        data: { wallet_password: state.onboarding.password }
      })
    )
  }

  // Handle create wallet.
  else if (state.lnd.creatingNewWallet) {
    dispatch(
      send('walletUnlocker', {
        msg: 'initWallet',
        data: {
          wallet_password: state.onboarding.password,
          cipher_seed_mnemonic: state.onboarding.seed
        }
      })
    )
  }

  // Handle recover wallet.
  else if (state.lnd.recoveringOldWallet) {
    dispatch(
      send('walletUnlocker', {
        msg: 'initWallet',
        data: {
          wallet_password: state.onboarding.password,
          cipher_seed_mnemonic: state.onboarding.seed,
          recovery_window: 250
        }
      })
    )
  }
}

export const walletCreated = () => dispatch => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch(onboardingFinished())
  dispatch(send('startLightningWallet'))
}

export const walletUnlocked = () => dispatch => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch(onboardingFinished())
  dispatch(send('startLightningWallet'))
}

export const setUnlockWalletError = (event, unlockWalletError) => dispatch => {
  dispatch({ type: SET_UNLOCK_WALLET_ERROR, unlockWalletError })
}

export const fetchSeed = () => async dispatch => {
  dispatch({ type: FETCH_SEED })
  try {
    await dispatch(
      startLnd({
        id: `tmp`,
        type: 'local',
        chain: 'bitcoin',
        network: 'testnet'
      })
    )
  } catch (error) {
    dispatch({ type: FETCH_SEED_ERROR, error })
  }
}

// Listener for when LND creates and sends us a generated seed
export const fetchSeedSuccess = (event, { cipher_seed_mnemonic }) => dispatch => {
  dispatch({ type: FETCH_SEED_SUCCESS, seed: cipher_seed_mnemonic })
  dispatch(setSeed(cipher_seed_mnemonic))
  dispatch(stopLnd())
}

// Listener for when LND throws an error on seed creation
export const fetchSeedError = (event, error) => dispatch => {
  dispatch({ type: FETCH_SEED_ERROR, error })
}

export const createNewWallet = () => async (dispatch, getState) => {
  const state = getState()

  // Define the wallet config.
  let wallet = {
    type: 'local',
    chain: 'bitcoin',
    network: 'testnet',
    autopilot: state.onboarding.autopilot,
    alias: state.onboarding.alias,
    name: state.onboarding.name
  }

  // Save the wallet config.
  wallet = await dispatch(putWallet(wallet))

  // Start Lnd and trigger the wallet to be initialised as soon as the wallet unlocker is available.
  dispatch({ type: CREATING_NEW_WALLET })
  await dispatch(startLnd(wallet))
}

export const recoverOldWallet = () => async (dispatch, getState) => {
  const state = getState()

  // Define the wallet config.
  let wallet = {
    type: 'local',
    chain: 'bitcoin',
    network: 'testnet',
    autopilot: state.onboarding.autopilot,
    alias: state.onboarding.alias,
    name: state.onboarding.name
  }

  // Save the wallet config.
  wallet = await dispatch(putWallet(wallet))

  // Start Lnd and trigger the wallet to be recovered as soon as the wallet unlocker is available.
  dispatch({ type: RECOVERING_OLD_WALLET })
  await dispatch(startLnd(wallet))
}

export const startActiveWallet = () => async (dispatch, getState) => {
  const state = getState()
  if (!state.lnd.lndStarted && !state.lnd.startingLnd) {
    const activeWalletSettings = walletSelectors.activeWalletSettings(state)
    if (activeWalletSettings) {
      await dispatch(startLnd(activeWalletSettings))
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [FETCH_SEED]: state => ({ ...state, fetchingSeed: true }),
  [FETCH_SEED_SUCCESS]: state => ({
    ...state,
    fetchingSeed: false,
    fetchSeedError: ''
  }),
  [FETCH_SEED_ERROR]: (state, { error }) => ({
    ...state,
    fetchingSeed: false,
    fetchSeedError: error
  }),

  [SET_SYNC_STATUS_PENDING]: state => ({ ...state, syncStatus: 'pending' }),
  [SET_SYNC_STATUS_WAITING]: state => ({ ...state, syncStatus: 'waiting' }),
  [SET_SYNC_STATUS_IN_PROGRESS]: state => ({ ...state, syncStatus: 'in-progress' }),
  [SET_SYNC_STATUS_COMPLETE]: state => ({ ...state, syncStatus: 'complete' }),

  [RECEIVE_CURRENT_BLOCK_HEIGHT]: (state, { blockHeight }) => ({
    ...state,
    blockHeight
  }),
  [RECEIVE_LND_BLOCK_HEIGHT]: (state, { lndBlockHeight }) => ({
    ...state,
    lndBlockHeight,
    lndFirstBlockHeight: state.lndFirstBlockHeight || lndBlockHeight
  }),
  [RECEIVE_LND_CFILTER_HEIGHT]: (state, { lndCfilterHeight }) => ({
    ...state,
    lndCfilterHeight,
    lndFirstCfilterHeight: state.lndFirstCfilterHeight || lndCfilterHeight
  }),

  [STARTING_LND]: state => ({
    ...state,
    startingLnd: true,
    lndStarted: false
  }),
  [LND_STARTED]: state => ({
    ...state,
    startingLnd: false,
    lndStarted: true
  }),
  [SET_START_LND_ERROR]: (state, { errors }) => ({
    ...state,
    startingLnd: false,
    startLndError: errors
  }),

  [SET_WALLET_UNLOCKER_ACTIVE]: state => ({
    ...state,
    startingLnd: false,
    walletUnlockerGrpcActive: true,
    lightningGrpcActive: false
  }),
  [SET_LIGHTNING_WALLET_ACTIVE]: state => ({
    ...state,
    startingLnd: false,
    lightningGrpcActive: true,
    walletUnlockerGrpcActive: false
  }),

  [STOPPING_LND]: state => ({
    ...state,
    stoppingLnd: true
  }),
  [LND_STOPPED]: state => ({
    ...state,
    ...initialState
  }),

  [CREATING_NEW_WALLET]: state => ({ ...state, creatingNewWallet: true }),
  [RECOVERING_OLD_WALLET]: state => ({ ...state, recoveringOldWallet: true }),
  [UNLOCKING_WALLET]: state => ({ ...state, unlockingWallet: true }),
  [WALLET_UNLOCKED]: state => ({
    ...state,
    unlockingWallet: false,
    unlockWalletError: ''
  }),
  [SET_UNLOCK_WALLET_ERROR]: (state, { unlockWalletError }) => ({
    ...state,
    unlockingWallet: false,
    unlockWalletError
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetchingSeed: false,
  startingLnd: false,
  stoppingLnd: false,
  lndStarted: false,
  creatingNewWallet: false,
  recoveringOldWallet: false,
  unlockingWallet: false,
  walletUnlockerGrpcActive: false,
  lightningGrpcActive: false,
  unlockWalletError: null,
  startLndError: null,
  fetchSeedError: null,
  syncStatus: 'pending',
  blockHeight: 0,
  lndBlockHeight: 0,
  lndFirstBlockHeight: 0,
  lndCfilterHeight: 0,
  lndFirstCfilterHeight: 0
}

// ------------------------------------
// Selectors
// ------------------------------------
const lndSelectors = {}
const blockHeightSelector = state => state.lnd.blockHeight
const lndBlockHeightSelector = state => state.lnd.lndBlockHeight
const lndFirstBlockHeightSelector = state => state.lnd.lndFirstBlockHeight
const lndCfilterHeightSelector = state => state.lnd.lndCfilterHeight
const lndFirstCfilterHeightSelector = state => state.lnd.lndFirstCfilterHeight
const startLndErrorSelector = state => state.lnd.startLndError
const isStartingLndSelector = state => state.lnd.startingLnd

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

lndSelectors.isStartingLnd = createSelector(
  isStartingLndSelector,
  isStarting => isStarting
)

lndSelectors.syncPercentage = createSelector(
  blockHeightSelector,
  lndBlockHeightSelector,
  lndFirstBlockHeightSelector,
  lndCfilterHeightSelector,
  lndFirstCfilterHeightSelector,
  (blockHeight, lndBlockHeight, lndFirstBlockHeight, lndCfilterHeight, lndFirstCfilterHeight) => {
    // blocks
    const blocksToSync = blockHeight - lndFirstBlockHeight
    const blocksRemaining = blockHeight - lndBlockHeight
    const blocksDone = blocksToSync - blocksRemaining

    // filters
    const filtersToSync = blockHeight - lndFirstCfilterHeight
    const filtersRemaining = blockHeight - lndCfilterHeight
    const filtersDone = filtersToSync - filtersRemaining

    // totals
    const totalToSync = blocksToSync + filtersToSync
    const done = blocksDone + filtersDone

    const percentage = Math.floor((done / totalToSync) * 100)

    if (percentage === Infinity || Number.isNaN(percentage)) {
      return undefined
    }

    return parseInt(percentage, 10)
  }
)

export { lndSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
//
export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
