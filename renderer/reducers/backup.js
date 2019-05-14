import { send } from 'redux-electron-ipc'
import { grpcService } from 'workers'
import { walletSelectors } from './wallet'
import { infoSelectors } from './info'

const getDbRec = async walletId => await window.db.backup.get(walletId)

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

export async function backupTokensUpdated(event, { provider, tokens, walletId }) {
  const backupDesc = await getDbRec(walletId)
  await setDbRec(walletId, {
    [provider]: { ...backupDesc[provider], tokens },
  })
}

export async function hasBackupSetup(walletId) {
  const backupDesc = await getDbRec(walletId)
  if (backupDesc) {
    const { activeProvider } = backupDesc
    return activeProvider && backupDesc[activeProvider]
  }

  return false
}

/**
 *
 *
 * @export
 * @param {string} walletId wallet identifier. if not specified uses current active wallet
 * @param {string} provider backup provider. if not specified attempts to use current active provider
 * @returns
 */
export function initBackupService(walletId, provider) {
  return async (dispatch, getState) => {
    const wId = walletId || walletSelectors.activeWallet(getState())

    const getServiceParams = async () => {
      const backupDesc = await getDbRec(wId)
      // attempt to initialize backup service with stored tokens
      if (backupDesc) {
        const { activeProvider } = backupDesc
        const { tokens } = backupDesc[activeProvider] || {}
        return { walletId: wId, tokens, provider: activeProvider }
      }

      return { walletId: wId, provider }
    }

    return dispatch(send('initBackupService', await getServiceParams()))
  }
}

export const backupCurrentWallet = backup => async (dispatch, getState) => {
  const getFreshBackup = async () => {
    const grpc = await grpcService
    if (grpc.services.Lightning.exportAllChannelBackups) {
      return await grpc.services.Lightning.exportAllChannelBackups({})
    }
    return null
  }

  const getBackupBuff = backupData =>
    backupData && backupData.multi_chan_backup && backupData.multi_chan_backup.multi_chan_backup

  try {
    const state = getState()
    const walletId = walletSelectors.activeWallet(state)
    const nodePub = infoSelectors.nodePub(state)
    if (walletId) {
      const backupData = backup || (await getFreshBackup())
      const { activeProvider, ...rest } = (await getDbRec(walletId)) || {}
      const backupMetadata = activeProvider && rest[activeProvider]
      const canBackup = backupData && activeProvider
      canBackup &&
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
  } catch (e) {
    // Do nothing
  }
}

export const backupSaveSuccess = async (event, { provider, backupId, walletId }) => {
  const backupDesc = await getDbRec(walletId)
  await setDbRec(walletId, {
    [provider]: { ...backupDesc[provider], backupId },
  })
}
export const backupServiceInitialized = (event, { walletId, provider }) => async dispatch => {
  await setDbRec(walletId, {
    activeProvider: provider,
  })
  dispatch(backupCurrentWallet())
}
