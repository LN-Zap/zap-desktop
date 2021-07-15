import { ipcMain } from 'electron'

import { mainLog } from '@zap/utils/log'

import getBackupService from './serviceFactory'

/**
 * createBackupService - Create backup service.
 *
 * @param {object} mainWindow Browser window
 */
export default function createBackupService(mainWindow) {
  // helper func to send messages to the renderer process
  const send = (msg, params) => mainWindow.webContents.send(msg, params)

  // sets up ipc to listen for backup service token updates and forward updates to
  // the renderer process
  const setupTokenUpdateListeners = (walletId, backupService) => {
    const handleTokensReceived = tokens => {
      // ensure the we are always storing the latest tokens available
      send('backupTokensUpdated', {
        tokens,
        provider: backupService.name,
        walletId,
      })
      mainLog.info('Tokens received: %o', tokens)
    }
    // re-subscribe for token updates
    backupService.removeAllListeners('tokensReceived')
    backupService.on('tokensReceived', handleTokensReceived)
  }

  ipcMain.on('initBackupService', async (event, { walletId, tokens, provider }) => {
    mainLog.info('Initializing backup service powered by: %s for wallet: %s', provider, walletId)
    try {
      const backupService = getBackupService(provider)
      // cleanup existing instance if any
      backupService.terminate()
      // we are dealing with cloud based backup strategies that emit token updates
      if (backupService.isUsingTokens) {
        setupTokenUpdateListeners(walletId, backupService)
        await backupService.init(tokens)
      } else {
        await backupService.init()
      }

      send('backupServiceInitialized', { walletId })
    } catch (e) {
      send('initBackupServiceError')
      mainLog.warn('Unable to initialize backup service: %o', e)
    }
  })

  ipcMain.on('queryBackup', async (event, { walletId, locationHint, nodePub, provider }) => {
    mainLog.info(
      'Query backup provider:%s, walletId:%s nodePub:%s locationHint:%s',
      provider,
      walletId,
      nodePub,
      locationHint
    )
    try {
      const backupService = getBackupService(provider)
      if (backupService) {
        const backup = await backupService.loadBackup({
          walletId: nodePub,
          locationHint,
        })
        if (backup) {
          mainLog.info('Backup found  %o', backup)
        } else {
          mainLog.info('Backup not found')
        }
        send('queryWalletBackupSuccess', { backup, walletId })
      }
    } catch (e) {
      send('queryWalletBackupFailure', { walletId })
      mainLog.warn(
        `Unable to query backup for wallet %s using provider %s:  %o`,
        walletId,
        provider,
        e
      )
    }
  })

  ipcMain.on(
    'saveBackup',
    async (event, { backup, walletId, provider, backupMetadata, nodePub }) => {
      try {
        const backupService = getBackupService(provider)
        if (backupService) {
          const locationHint = await backupService.saveBackup({
            walletId: nodePub,
            locationHint: backupMetadata && backupMetadata.locationHint,
            backup,
          })
          mainLog.info('Backup updated, locationHint: %s', locationHint)
          send('saveBackupSuccess', {
            locationHint,
            provider: backupService.name,
            walletId,
          })
          mainLog.info(`saveBackup ${walletId} ${nodePub}`)
        }
      } catch (e) {
        mainLog.warn('Unable to backup wallet: %o', e)
        send('saveBackupError')
      }
    }
  )
}
