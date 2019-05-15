import { send } from 'redux-electron-ipc'
import { grpcService } from 'workers'
import { walletSelectors } from './wallet'
import { infoSelectors } from './info'

const SET_PROVIDER = 'SET_PROVIDER'

const getDbRec = async walletId => await window.db.backup.get(walletId)
/**
 * Convenience wrapper that tries to update existing DB record and if fails insert new one
 * @param {string} walletId
 * @param {Object} update
 */
const setDbRec = async (walletId, update) => {
  const updated = await window.db.backup.update(walletId, update)
  if (updated === 0) {
    try {
      await window.db.backup.add({ id: walletId, ...update })
    } catch (e) {
      // Do nothing if there was an error - this indicates that the item already exists and was unchanged.
    }
  }
}

/**
 * IPC callback for backup service tokens update event
 *
 * @export
 * @param {*} event
 * @param {*} { provider, tokens, walletId }
 */
export async function backupTokensUpdated(event, { provider, tokens, walletId }) {
  const backupDesc = (await getDbRec(walletId)) || {}
  await setDbRec(walletId, {
    [provider]: { ...backupDesc[provider], tokens },
  })
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
      const backupDesc = await getDbRec(wId)
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
export const backupCurrentWallet = backup => async (dispatch, getState) => {
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
    const walletId = walletSelectors.activeWallet(state)
    // there is not current active wallet
    if (!walletId) {
      return
    }
    const nodePub = infoSelectors.nodePub(state)
    const { activeProvider, ...rest } = (await getDbRec(walletId)) || {}
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
    // TODO: add notification that backup has failed and user attention may be required
  }
}

export const backupSaveSuccess = async (event, { provider, backupId, walletId }) => {
  const backupDesc = (await getDbRec(walletId)) || {}
  await setDbRec(walletId, {
    [provider]: { ...backupDesc[provider], backupId },
  })
}
/**
 * IPC callback for backup service being ready
 */
export const backupServiceInitialized = (event, { walletId, provider }) => async dispatch => {
  await setDbRec(walletId, {
    activeProvider: provider,
  })
  dispatch(backupCurrentWallet())
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
