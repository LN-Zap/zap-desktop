import set from 'lodash.set'
import { send } from 'redux-electron-ipc'
import { grpcService } from 'workers'
import { walletSelectors } from './wallet'
import { infoSelectors } from './info'

const SET_PROVIDER = 'SET_PROVIDER'

const dbGet = async walletId => {
  const wallet = await window.db.wallets.get(walletId)
  return wallet && wallet.backup
}

/**
 * Convenience wrapper that tries to update existing DB record and if fails insert new one
 *
 * @param {string} walletId
 * @param {Object} update
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
    const wId = walletId || walletSelectors.activeWallet(getState())
    // returns backup service startup params based on serialized data availability
    const getServiceParams = async () => {
      const backupDesc = await dbGet(wId)
      // attempt to initialize backup service with stored tokens
      if (backupDesc) {
        const { activeProvider } = backupDesc
        dispatch(setBackupProvider(activeProvider))
        const { tokens } = backupDesc[activeProvider] || {}
        return { walletId: wId, tokens, provider: activeProvider }
      }

      return { walletId: wId, provider: backupSelectors.providerSelector(getState()) }
    }
    const params = await getServiceParams()

    // do not initialize service if no tokens are available and forceUseToken is enabled
    // this allows to skip backup service initialization for wallets that don't have backup process
    // set up previously
    if (!params.tokens && forceUseTokens) {
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
    const nodePub = infoSelectors.nodePub(state)
    const { activeProvider, ...rest } = (await dbGet(walletId)) || {}
    if (activeProvider) {
      const backupData = backup || (await getFreshBackup())
      if (backupData) {
        const backupMetadata = activeProvider && rest[activeProvider]
        dispatch(
          send('saveBackup', {
            backup: getBackupBuff(backupData),
            walletId,
            backupMetadata,
            nodePub,
            provider: activeProvider,
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

export const saveBackupSuccess = (event, { provider, backupId, walletId }) => async () => {
  await dbTransaction(async () => {
    const backupDesc = (await dbGet(walletId)) || {}
    set(backupDesc, [provider, 'backupId'], backupId)
    await dbUpdate(walletId, backupDesc)
  })
}

/**
 * IPC callback for backup service being ready
 */
export const backupServiceInitialized = (event, { walletId, provider }) => async dispatch => {
  await dbTransaction(async () => {
    const backupDesc = (await dbGet(walletId)) || {}
    backupDesc.activeProvider = provider
    await dbUpdate(walletId, backupDesc)
  })

  dispatch(backupCurrentWallet(walletId))
}

/**
 * Set
 * @param {('gdrive'|'local'|'dropbox')} provider - backup service provider to be used in `initBackupService` call
 */
export const setBackupProvider = provider => {
  return {
    type: SET_PROVIDER,
    provider,
  }
}

const ACTION_HANDLERS = {
  [SET_PROVIDER]: (state, { provider }) => ({
    ...state,
    provider,
  }),
}

const initialState = {
  provider: 'gdrive',
}

// Selectors
const backupSelectors = {}
backupSelectors.providerSelector = state => state.backup.provider

export { backupSelectors }

export default function backupReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
