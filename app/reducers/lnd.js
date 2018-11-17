import { ipcRenderer } from 'electron'
import { createSelector } from 'reselect'
import { showNotification } from 'lib/utils/notifications'
import db from 'store/db'
import { fetchBalance } from './balance'
import { fetchInfo, setHasSynced, infoSelectors } from './info'
import { putWallet, setActiveWallet } from './wallet'
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
export const lndSyncStatus = (event, status) => async (dispatch, getState) => {
  const notifTitle = 'Lightning Node Synced'
  const notifBody = "Visa who? You're your own payment processor now!"

  // Persist the fact that the wallet has been synced at least once.
  const state = getState()
  const pubKey = state.info.data.identity_pubkey
  const hasSynced = infoSelectors.hasSynced(state)

  if (pubKey && !hasSynced) {
    const updated = await db.nodes.update(pubKey, { hasSynced: true })
    if (!updated) {
      await db.nodes.add({ id: pubKey, hasSynced: true })
    }
  }

  switch (status) {
    case 'waiting':
      dispatch({ type: SET_SYNC_STATUS_WAITING })
      break
    case 'in-progress':
      dispatch({ type: SET_SYNC_STATUS_IN_PROGRESS })
      break
    case 'complete':
      dispatch({ type: SET_SYNC_STATUS_COMPLETE })

      dispatch(setHasSynced(true))

      // Fetch data now that we know LND is synced
      dispatch(fetchBalance())
      dispatch(fetchInfo())

      // HTML 5 desktop notification for the new transaction
      showNotification(notifTitle, notifBody)
      break
    default:
      dispatch({ type: SET_SYNC_STATUS_PENDING })
  }
}

// Connected to Lightning gRPC interface (lnd wallet is connected and unlocked)
export const lightningGrpcActive = (event, lndConfig) => async dispatch => {
  dispatch({ type: SET_LIGHTNING_WALLET_ACTIVE })

  // Once we we have established a connection, save the wallet settings.
  if (lndConfig.id !== 'tmp') {
    const wallet = await dispatch(putWallet(lndConfig))
    dispatch(setActiveWallet(wallet.id))
  }

  // Fetch info from lnd.
  dispatch(fetchInfo())

  // Let the onboarding process know that the wallet has started.
  dispatch(onboardingFinished())
}

// Connected to WalletUnlocker gRPC interface (lnd is ready to unlock or create wallet)
export const walletUnlockerGrpcActive = (event, lndConfig) => async dispatch => {
  dispatch({ type: SET_WALLET_UNLOCKER_ACTIVE })

  // Once we we have established a connection, save the wallet settings.
  if (lndConfig.id !== 'tmp') {
    const wallet = await dispatch(putWallet(lndConfig))
    dispatch(setActiveWallet(wallet.id))
  }

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
    ipcRenderer.send('startLnd', options)

    ipcRenderer.once('startLndError', error => {
      ipcRenderer.removeListener('startLndSuccess', resolve)
      reject(error)
    })

    ipcRenderer.once('startLndSuccess', res => {
      ipcRenderer.removeListener('startLndError', reject)
      resolve(res)
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
    ipcRenderer.send('stopLnd')
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
  ipcRenderer.send('walletUnlocker', {
    msg: 'unlockWallet',
    data: { wallet_password: password }
  })
}

export const restart = () => () => {
  ipcRenderer.send('restart')
}

/**
 * As soon as we have an active connection to a WalletUnlocker service, attempt to generate a new seed which kicks off
 * the process of creating or unlocking a wallet.
 */
export const lndWalletUnlockerStarted = () => (dispatch, getState) => {
  const state = getState().lnd
  const onboardingState = getState().onboarding

  // Handle generate seed.
  if (state.fetchingSeed) {
    ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
  }

  // Handle unlock wallet.
  else if (state.unlockingWallet) {
    ipcRenderer.send('walletUnlocker', {
      msg: 'unlockWallet',
      data: { wallet_password: onboardingState.password }
    })
  }

  // Handle create wallet.
  else if (state.creatingNewWallet) {
    ipcRenderer.send('walletUnlocker', {
      msg: 'initWallet',
      data: {
        wallet_password: onboardingState.password,
        cipher_seed_mnemonic: onboardingState.seed
      }
    })
  }

  // Handle recover wallet.
  else if (state.recoveringOldWallet) {
    ipcRenderer.send('walletUnlocker', {
      msg: 'initWallet',
      data: {
        wallet_password: onboardingState.password,
        cipher_seed_mnemonic: onboardingState.seed,
        recovery_window: 250
      }
    })
  }
}

export const walletCreated = () => dispatch => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch(onboardingFinished())
  ipcRenderer.send('startLightningWallet')
}

export const walletUnlocked = () => dispatch => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch(onboardingFinished())
  ipcRenderer.send('startLightningWallet')
}

export const setUnlockWalletError = (event, unlockWalletError) => dispatch => {
  dispatch({ type: SET_UNLOCK_WALLET_ERROR, unlockWalletError })
}

export const fetchSeed = () => async dispatch => {
  dispatch({ type: FETCH_SEED })
  await dispatch(
    startLnd({
      id: `tmp`,
      type: 'local',
      chain: 'bitcoin',
      network: 'testnet'
    })
  )
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
  const onboardingState = getState().onboarding

  // Define the wallet config.
  let wallet = {
    type: 'local',
    chain: 'bitcoin',
    network: 'testnet',
    settings: {
      autopilot: onboardingState.autopilot,
      alias: onboardingState.alias
    }
  }

  // Save the wallet config.
  wallet = await dispatch(putWallet(wallet))

  // Start Lnd and trigger the wallet to be initialised as soon as the wallet unlocker is available.
  dispatch({ type: CREATING_NEW_WALLET })
  await dispatch(startLnd(wallet))
}

export const recoverOldWallet = () => async dispatch => {
  // Define the wallet config.
  let wallet = {
    type: 'local',
    chain: 'bitcoin',
    network: 'testnet'
  }

  // Save the wallet config.
  wallet = await dispatch(putWallet(wallet))

  // Start Lnd and trigger the wallet to be recovered as soon as the wallet unlocker is available.
  dispatch({ type: RECOVERING_OLD_WALLET })
  await dispatch(startLnd(wallet))
}

export const startActiveWallet = () => async (dispatch, getState) => {
  const state = getState().lnd
  if (!state.lndStarted && !state.startingLnd) {
    const activeWallet = await db.settings.get({ key: 'activeWallet' })
    if (activeWallet) {
      const wallet = await db.wallets.get({ id: activeWallet.value })
      if (wallet) {
        dispatch(startLnd(wallet))
      }
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
  [RECEIVE_LND_BLOCK_HEIGHT]: (state, { lndBlockHeight }) => ({ ...state, lndBlockHeight }),
  [RECEIVE_LND_CFILTER_HEIGHT]: (state, { lndCfilterHeight }) => ({ ...state, lndCfilterHeight }),

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
    startLndHostError: errors.host,
    startLndCertError: errors.cert,
    startLndMacaroonError: errors.macaroon
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
  unlockWalletError: '',
  startLndHostError: '',
  startLndCertError: '',
  startLndMacaroonError: '',
  fetchSeedError: '',
  syncStatus: 'pending',
  blockHeight: 0,
  lndBlockHeight: 0,
  lndCfilterHeight: 0
}

// ------------------------------------
// Selectors
// ------------------------------------
const lndSelectors = {}
const blockHeightSelector = state => state.lnd.blockHeight
const lndBlockHeightSelector = state => state.lnd.lndBlockHeight
const lndCfilterHeightSelector = state => state.lnd.lndCfilterHeight

lndSelectors.syncPercentage = createSelector(
  blockHeightSelector,
  lndBlockHeightSelector,
  lndCfilterHeightSelector,
  (blockHeight, lndBlockHeight, lndCfilterHeight) => {
    // We set the total amount to the blockheight x 2 because there are twi pahases to the sync process that each
    // take about the same amount of time (syncing blocks and syncing cfilters)
    const percentage = Math.floor(((lndBlockHeight + lndCfilterHeight) / (blockHeight * 2)) * 100)

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
