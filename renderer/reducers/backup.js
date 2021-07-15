import set from 'lodash/set'
import { send } from 'redux-electron-ipc'

import { getIntl } from '@zap/i18n'
import createReducer from '@zap/utils/createReducer'
import { isSCBRestoreEnabled } from '@zap/utils/featureFlag'
import { showError, showNotification } from 'reducers/notification'
import { grpc } from 'workers'

import { infoSelectors } from './info'
import messages from './messages'
import { walletSelectors } from './wallet'
// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  provider: null,
  localPath: null,
  isRestoreMode: false,
}

// ------------------------------------
// Constants
// ------------------------------------

export const SET_PROVIDER = 'SET_PROVIDER'
export const SET_LOCAL_PATH = 'SET_LOCAL_PATH'
export const SET_RESTORE_MODE = 'SET_RESTORE_MODE'

const RESTORE_STATE_STARTED = 'started'
const RESTORE_STATE_COMPLETE = 'complete'
const RESTORE_STATE_ERROR = 'error'

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * canBackup - Checks if we are allowed to update existing backups.
 *
 * @param {string} walletId Wallet Id
 * @returns {boolean} Boolean indicatin whether a wallet can backup from its current state.
 */
const canBackup = async walletId => {
  const backupDesc = (await dbGet(walletId)) || {}
  const { channelsRestoreState } = backupDesc
  return !channelsRestoreState || channelsRestoreState === RESTORE_STATE_COMPLETE
}

/**
 * dbGet - Get database config for a wallet.
 *
 * @param {string} walletId Wallet Id
 * @returns {Function} Thunk
 */
const dbGet = async walletId => {
  const wallet = await window.db.wallets.get(walletId)
  return wallet && wallet.backup
}

/**
 * dbUpdate - Update existing DB record and if fails insert new one.
 *
 * @param {string} walletId Wallet Id
 * @param {object} update Updates to apply
 * @returns {Function} Thunk
 */
const dbUpdate = async (walletId, update) => {
  return window.db.wallets.update(walletId, { backup: update })
}

/**
 * dbTransaction - Get database config for a wallet.
 *
 * @param {Function} operation Database transaction
 * @returns {Promise} Promise that resolves once the transaction has completed
 */
const dbTransaction = operation => {
  return window.db.transaction('rw', window.db.wallets, operation)
}

// ------------------------------------
// IPC
// ------------------------------------

/**
 * backupTokensUpdated - IPC callback for backup service tokens update event.
 *
 * @param {object} event Event
 * @param {{provider, tokens, walletId}} options Options
 * @returns {Function} Thunk
 */
export const backupTokensUpdated = (event, { provider, tokens, walletId }) => {
  return async () => {
    await dbTransaction(async () => {
      const backupDesc = (await dbGet(walletId)) || {}
      set(backupDesc, [provider, 'tokens'], tokens)
      await dbUpdate(walletId, backupDesc)
    })
  }
}

/**
 * backupServiceInitialized - IPC callback for backup service being ready.
 *
 * @param {object} event Event
 * @param {{walletId}} options Options
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const backupServiceInitialized = (event, { walletId }) => async (dispatch, getState) => {
  const state = getState()
  const isRestoreMode = backupSelectors.restoreModeSelector(state)
  // service is in restore mode
  if (isRestoreMode) {
    dispatch(queryWalletBackup(walletId, backupSelectors.providerSelector(state)))
  } else {
    dispatch(backupCurrentWallet(walletId))
  }
}

/**
 * saveBackupSuccess - IPC callback for successful backup.
 *
 * @param {object} event Event
 * @param {{ provider, locationHint, walletId }} options Options
 * @returns {Function} Thunk
 */
export const saveBackupSuccess = (event, { provider, locationHint, walletId }) => async () => {
  return updateLocationHint({ provider, locationHint, walletId })
}

/**
 * queryWalletBackupSuccess - Success callback for queryWalletBackup.
 *
 * @param {object} event Event
 * @param {{ walletId, backup }} options Options
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const queryWalletBackupSuccess = (event, { walletId, backup }) => async dispatch => {
  try {
    await dispatch(restoreWallet(backup))
    dispatch(setRestoreMode(false))
    await setRestoreState(walletId, RESTORE_STATE_COMPLETE)
  } catch (e) {
    await setRestoreState(walletId, RESTORE_STATE_ERROR)
  }
}

/**
 * queryWalletBackupFailure - Error callback for queryWalletBackup.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const queryWalletBackupFailure = () => async dispatch => {
  dispatch(showError(getIntl().formatMessage(messages.backup_not_found_error)))
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setBackupProvider - Sets current backup provider.
 *
 * @param {('gdrive'|'local'|'dropbox')} provider backup service provider to be used in `initBackupService` call
 * @returns {object} Action
 */
export const setBackupProvider = provider => {
  return {
    type: SET_PROVIDER,
    provider,
  }
}

/**
 * setBackupPathLocal - Sets backup path for the local strategy.
 *
 * @param {string} localPath local filesystem directory URI
 * @returns {object} Action
 */
export const setBackupPathLocal = localPath => {
  return {
    type: SET_LOCAL_PATH,
    localPath,
  }
}
/**
 * setRestoreMode - Turns restore mode on/off.
 *
 * @param {boolean} value true if restore mode is active
 * @returns {object} Action
 */
export const setRestoreMode = value => {
  return {
    type: SET_RESTORE_MODE,
    isRestoreMode: isSCBRestoreEnabled() && value,
  }
}

/**
 * setupBackupService - Sets backup related properties into DB and initializes backup service.
 * Should be used once per `walletId` during wallet lifetime
 * to prepare backup service for the operation
 * once backup is setup, `initBackupService` should be used in subsequent sessions
 * to launch the service.
 *
 * @param {string} walletId Wallet Id
 * @param {boolean} isRestoreMode Boolean indcation whether this is a restore
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const setupBackupService = (walletId, isRestoreMode) => async (dispatch, getState) => {
  const { providerSelector, localPathSelector } = backupSelectors
  const provider = providerSelector(getState())

  // provider is not chosen -> service initialization is skipped
  if (!provider) {
    return
  }

  const isLocalStrategy = provider === 'local'

  if (isRestoreMode) {
    await setRestoreState(walletId, RESTORE_STATE_STARTED)
  }

  await updateBackupProvider(walletId, provider)

  if (isLocalStrategy) {
    const dir = localPathSelector(getState())
    // we have backup dir setup in redux, use it to initialize db backup setup
    if (dir) {
      const nodePub = infoSelectors.nodePubkey(getState())
      await updateLocationHint({
        provider,
        locationHint: window.Zap.normalizeBackupDir(nodePub, dir),
        walletId,
      })
      dispatch(setBackupPathLocal(null))
    }
  }

  dispatch(send('initBackupService', { walletId, provider }))
}

/**
 * setRestoreState - Sets current restore state.
 *
 * @param {string} walletId Wallet Id
 * @param {(RESTORE_STATE_STARTED|RESTORE_STATE_COMPLETE|RESTORE_STATE_ERROR)} state State
 * @returns {Function} Thunk
 */
const setRestoreState = async (walletId, state) => {
  return dbTransaction(async () => {
    const backupDesc = (await dbGet(walletId)) || {}
    backupDesc.channelsRestoreState = state
    return dbUpdate(walletId, backupDesc)
  })
}

/**
 * initBackupService - Initializes backup service for the specified wallet. Backup provider must be either set in db
 * or in `state.backup.provider` before calling this routine. Also starts SCB recovery if there is one pending.
 * Should be called after sync is complete e.g `syncedToChain` is true.
 *
 * @param {string} walletId Wallet identifier. if not specified uses current active wallet
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const initBackupService = walletId => async (dispatch, getState) => {
  const wId = walletId || walletSelectors.activeWallet(getState())
  const backupDesc = await dbGet(wId)

  // do not initialize service if it wasn't setup previously
  if (!backupDesc) {
    return
  }

  const { channelsRestoreState } = backupDesc
  // initiate restore mode if it's pending
  dispatch(setRestoreMode(channelsRestoreState === RESTORE_STATE_STARTED))
  // returns backup service startup params based on serialized data availability
  const getServiceParams = async () => {
    // attempt to initialize backup service with stored tokens
    const { activeProviders } = backupDesc
    const [firstProvider] = activeProviders

    await dispatch(setBackupProvider(firstProvider))
    const { tokens } = backupDesc[firstProvider] || {}
    return { walletId: wId, tokens, provider: firstProvider }
  }
  const params = await getServiceParams()
  dispatch(send('initBackupService', params))
}

/**
 * backupCurrentWallet - Backs up current active wallet.
 *
 * @param {string} walletId Wallet identifier. if not specified uses current active wallet
 * @param {object} backup Backup data
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const backupCurrentWallet = (walletId, backup) => async (dispatch, getState) => {
  const getFreshBackup = async () => {
    if (await grpc.services.Lightning.hasMethod('exportAllChannelBackups')) {
      return grpc.services.Lightning.exportAllChannelBackups({})
    }
    return null
  }

  // returns binary representation of channel backups as a buffer
  const getBackupBuff = backupData =>
    backupData && backupData.multiChanBackup && backupData.multiChanBackup.multiChanBackup

  try {
    const state = getState()
    // there is no current active wallet
    if (!walletId || !(await canBackup(walletId))) {
      return
    }

    const nodePub = infoSelectors.nodePubkey(state)
    const { activeProviders, ...rest } = (await dbGet(walletId)) || {}

    if (activeProviders) {
      const [firstProvider] = activeProviders
      const backupData = backup || (await getFreshBackup())
      if (backupData && firstProvider) {
        const backupMetadata = rest[firstProvider]
        dispatch(
          send('saveBackup', {
            backup: getBackupBuff(backupData),
            walletId,
            backupMetadata,
            nodePub,
            provider: firstProvider,
          })
        )
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e)
    // TODO: add notification that backup has failed and user attention may be required
  }
}

/**
 * updateLocationHint - Updates wallets' locationHint in the DB.
 *
 * @param {{ provider, locationHint, walletId }} options Options
 *  @returns {Function} Thunk
 */
export const updateLocationHint = async ({ provider, locationHint, walletId }) => {
  return dbTransaction(async () => {
    const backupDesc = (await dbGet(walletId)) || {}
    set(backupDesc, [provider, 'locationHint'], locationHint)
    return dbUpdate(walletId, backupDesc)
  })
}

/**
 * updateBackupProvider - Updates wallet's backup provider in the DB.
 *
 * @param {string} walletId Wallet identifier
 * @param {string} provider Provider name
 * @returns {Function} Thunk
 */
async function updateBackupProvider(walletId, provider) {
  return dbTransaction(async () => {
    const backupDesc = (await dbGet(walletId)) || {}
    const { activeProviders = [] } = backupDesc

    if (!activeProviders.includes(provider)) {
      backupDesc.activeProviders = [...activeProviders, provider]
    }

    return dbUpdate(walletId, backupDesc)
  })
}

/**
 * queryWalletBackup - Query a backup provider for a wallet.
 *
 * @param {string} walletId Wallet identifier
 * @param {string} provider Provider name
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const queryWalletBackup = (walletId, provider) => async (dispatch, getState) => {
  const backupDesc = (await dbGet(walletId)) || {}
  if (backupDesc[provider]) {
    const state = getState()
    const nodePub = infoSelectors.nodePubkey(state)
    const { locationHint } = backupDesc[provider]
    dispatch(send('queryBackup', { walletId, locationHint, nodePub, provider }))
  }
}

/**
 * restoreWallet - Restore a wallet backup.
 *
 * @param {object} backup Restore a channel backup
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const restoreWallet = backup => async dispatch => {
  const intl = getIntl()
  try {
    const result = await grpc.services.Lightning.restoreChannelBackups({
      multiChanBackup: backup,
    })
    dispatch(showNotification(intl.formatMessage(messages.backup_import_success)))
    return result
  } catch (e) {
    dispatch(showError(intl.formatMessage(messages.backup_import_error, { error: e.message })))
    return null
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_PROVIDER]: (state, { provider }) => {
    state.provider = provider
  },
  [SET_LOCAL_PATH]: (state, { localPath }) => {
    state.localPath = localPath
  },
  [SET_RESTORE_MODE]: (state, { isRestoreMode }) => {
    state.isRestoreMode = isRestoreMode
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const backupSelectors = {}
backupSelectors.providerSelector = state => state.backup.provider
backupSelectors.localPathSelector = state => state.backup.localPath
backupSelectors.restoreModeSelector = state => state.backup.isRestoreMode

export { backupSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
