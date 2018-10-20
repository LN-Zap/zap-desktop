import { createSelector } from 'reselect'
import { showNotification } from 'lib/utils/notifications'
import db from 'store/db'
import { fetchBalance } from './balance'
import { fetchInfo, setHasSynced, infoSelectors } from './info'
import { lndWalletStarted, lndWalletUnlockerStarted } from './onboarding'

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
export const lightningGrpcActive = (event, lndConfig) => dispatch => {
  dispatch({ type: SET_LIGHTNING_WALLET_ACTIVE })

  // Let the onboarding process know that wallet is active.
  dispatch(lndWalletStarted(lndConfig))
}

// Connected to WalletUnlocker gRPC interface (lnd is ready to unlock or create wallet)
export const walletUnlockerGrpcActive = () => dispatch => {
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

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
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

  [SET_WALLET_UNLOCKER_ACTIVE]: state => ({
    ...state,
    walletUnlockerGrpcActive: true,
    lightningGrpcActive: false
  }),
  [SET_LIGHTNING_WALLET_ACTIVE]: state => ({
    ...state,
    lightningGrpcActive: true,
    walletUnlockerGrpcActive: false
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  syncStatus: 'pending',
  walletUnlockerGrpcActive: false,
  lightningGrpcActive: false,
  blockHeight: 0,
  lndBlockHeight: 0,
  lndCfilterHeight: 0
}

// ------------------------------------
// Reducer
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

export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
