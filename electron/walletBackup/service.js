import { ipcMain } from 'electron'
import { mainLog } from '@zap/utils/log'
import getBackupService from './serviceFactory'

export default function createBackupService(mainWindow) {
  // helper func to send messages to the renderer process
  const send = (msg, params) => mainWindow.webContents.send(msg, params)

  ipcMain.on('initBackupService', async (event, { walletId, tokens, provider }) => {
    mainLog.info('Initializing backup service powered by: %s for wallet: %s', provider, walletId)
    try {
      const backupService = getBackupService(provider)
      // cleanup existing instance if any
      backupService.logout()
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

      await backupService.login(tokens)
      send('backupServiceInitialized', { walletId, provider })
    } catch (e) {
      mainLog.warn('Unable to initialize backup service: %o', e)
    }
  })

  ipcMain.on(
    'saveBackup',
    async (event, { backup, walletId, provider, backupMetadata, nodePub }) => {
      try {
        const backupService = getBackupService(provider)
        if (backupService) {
          const backupId = await backupService.saveBackup(
            nodePub,
            backupMetadata && backupMetadata.backupId,
            backup
          )
          mainLog.info('Backup updated. GDrive fileID: %s', backupId)
          send('saveBackupSuccess', {
            backupId,
            provider: backupService.name,
            walletId,
          })
          mainLog.info(`saveBackup ${walletId} ${nodePub}`)
        }
      } catch (e) {
        mainLog.warn('Unable to backup wallet: %o', e)
        mainWindow.webContents.send('saveBackupError')
      }
    }
  )
}

export getBackupService from './gdrive'
