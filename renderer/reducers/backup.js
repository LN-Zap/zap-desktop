import set from 'lodash/set'
import { send } from 'redux-electron-ipc'
import { grpcService } from 'workers'
import { walletSelectors } from './wallet'
import { infoSelectors } from './info'

const SET_PROVIDER = 'SET_PROVIDER'
const SET_LOCAL_PATH = 'SET_LOCAL_PATH'

const dbGet = async walletId => {
  const wallet = await window.db.wallets.get(walletId)
  return wallet && wallet.backup
}

/**
 * Convenience wrapper that tries to update existing DB record and if fails insert new one
 *
 * @param {string} walletId
 * @param {object} update
 */
const dbUpdate = async (walletId, update) => {
  return await window.db.wallets.update(walletId, { backup: update })
}

const dbTransaction = operation => {
  return window.db.transaction('rw', window.db.wallets, operation)
}

/**
 * IPC callback for backup service tokens update event
 *
 * @export
 * @param {*} event
 * @param {*} { provider, tokens, walletId }
 */
export function backupTokensUpdated(event, { provider, tokens, walletId }) {
  return async () => {
    await dbTransaction(async () => {
      const backupDesc = (await dbGet(walletId)) || {}
      set(backupDesc, [provider, 'tokens'], tokens)
      await dbUpdate(walletId, backupDesc)
    })
  }
}

/**
 * Sets backup related properties into DB and initializes backup service
 * Should be used once per `walletId` during wallet lifetime
 * to prepare backup service for the operation
 * Once backup is setup, `initBackupService` should be used in subsequent sessions
 * to launch the service
 *
 * @export
 * @param {string} walletId
 * @returns
 */
export function setupBackupService(walletId) {
  return async (dispatch, getState) => {
    const { providerSelector, localPathSelector } = backupSelectors
    const provider = providerSelector(getState())
    const isLocalStrategy = provider === 'local'

    await updateBackupProvider(walletId, provider)
    if (isLocalStrategy) {
      const dir = localPathSelector(getState())
      // we have backup dir setup in redux, use it to initialize db backup setup
      if (dir) {
        updateBackupId({ provider, backupId: dir, walletId })
        dispatch(setBackupPathLocal(null))
      }
    }

    dispatch(initBackupService(walletId, false))
  }
}

/**
 * Initializes backup service for the specified wallet. Backup provider must be either set in db
 * or in `state.backup.provider` before calling this routine
 *
 * @export
 * @param {string} walletId - wallet identifier. if not specified uses current active wallet
 * @param {boolean}  forceUseTokens - if true only initializes service if it was previously set up
 * and has tokens stored
 */
export function initBackupService(walletId, forceUseTokens = false) {
  return async (dispatch, getState) => {
    const { providerSelector } = backupSelectors
    const wId = walletId || walletSelectors.activeWallet(getState())
    const isLocalStrategy = () => providerSelector(getState()) === 'local'

    // returns backup service startup params based on serialized data availability
    const getServiceParams = async () => {
      const backupDesc = await dbGet(wId)
      // attempt to initialize backup service with stored tokens
      if (backupDesc) {
        const { activeProviders } = backupDesc
        const [firstProvider] = activeProviders
        await dispatch(setBackupProvider(firstProvider))
        const { tokens } = backupDesc[firstProvider] || {}
        return { walletId: wId, tokens, provider: firstProvider }
      }

      return { walletId: wId, provider: providerSelector(getState()) }
    }
    const params = await getServiceParams()

    // do not initialize service if no tokens are available and forceUseToken is enabled
    // this allows to skip backup service initialization for wallets that don't have backup process
    // set up previously
    if (!isLocalStrategy() && !params.tokens && forceUseTokens) {
      return
    }

    return dispatch(send('initBackupService', params))
  }
}

/**
 * Backs up current active wallet
 */
export const backupCurrentWallet = (walletId, backup) => async (dispatch, getState) => {
  const getFreshBackup = async () => {
    const grpc = await grpcService
    if (await grpc.services.Lightning.hasMethod('exportAllChannelBackups')) {
      return await grpc.services.Lightning.exportAllChannelBackups({})
    }
    return null
  }
  // returns binary representation of channel backups as a buffer
  const getBackupBuff = backupData =>
    backupData && backupData.multi_chan_backup && backupData.multi_chan_backup.multi_chan_backup

  try {
    const state = getState()
    // there is not current active wallet
    if (!walletId) {
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
 * IPC callback for successful backup
 */
export const saveBackupSuccess = (event, { provider, backupId, walletId }) => async () => {
  await updateBackupId({ provider, backupId, walletId })
}

/**
 * updates wallets' backupID in the DB
 */
export const updateBackupId = async ({ provider, backupId, walletId }) => {
  const backupDesc = (await dbGet(walletId)) || {}
  set(backupDesc, [provider, 'backupId'], backupId)
  await dbUpdate(walletId, backupDesc)
}

/**
 * IPC callback for backup service being ready
 */
export const backupServiceInitialized = (event, { walletId }) => async dispatch => {
  dispatch(backupCurrentWallet(walletId))
}

/**
 * updates wallets' backup provider in the DB
 */
async function updateBackupProvider(walletId, provider) {
  await dbTransaction(async () => {
    const backupDesc = (await dbGet(walletId)) || {}
    const { activeProviders = [] } = backupDesc

    if (!activeProviders.includes(provider)) {
      backupDesc.activeProviders = [...activeProviders, provider]
    }

    await dbUpdate(walletId, backupDesc)
  })
}

/**
 * Set
 *
 * @param {('gdrive'|'local'|'dropbox')} provider  backup service provider to be used in `initBackupService` call
 */
export const setBackupProvider = provider => {
  return {
    type: SET_PROVIDER,
    provider,
  }
}

/**
 * Set
 *
 * @param {string} localPath local filesystem directory URI
 */
export const setBackupPathLocal = localPath => {
  return {
    type: SET_LOCAL_PATH,
    localPath,
  }
}

const ACTION_HANDLERS = {
  [SET_PROVIDER]: (state, { provider }) => ({
    ...state,
    provider,
  }),
  [SET_LOCAL_PATH]: (state, { localPath }) => ({
    ...state,
    localPath,
  }),
}

const initialState = {
  provider: null,
}

// Selectors
const backupSelectors = {}
backupSelectors.providerSelector = state => state.backup.provider
backupSelectors.localPathSelector = state => state.backup.localPath

export { backupSelectors }

export default function backupReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
