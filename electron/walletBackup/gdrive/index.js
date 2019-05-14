import EventEmitter from 'events'
import config from 'config'
import { mainLog } from '@zap/utils/log'
import createClient from './gdrive'

export function forwardEvent(service, event, target) {
  service.on(event, data => target.emit(event, data))
}

class BackupService extends EventEmitter {
  drive = null

  constructor() {
    super()
  }

  async logout() {
    const { drive } = this
    drive && drive.removeAllListeners('tokensReceived')
    this.drive = null
  }

  async login(tokens) {
    const { redirectUrl, clientId, scope } = config.backup.gdrive
    const { drive } = this
    if (!drive) {
      this.drive = await createClient({
        clientId,
        authRedirectUrl: redirectUrl,
        scope,
        tokens,
      })
      mainLog.info('forwardEvent')
      forwardEvent(this.drive, 'tokensReceived', this)
    }

    return true
  }

  async isLoggedIn() {
    const { drive } = this
    return await drive.testConnection()
  }

  getTokens() {
    const { drive } = this
    return drive.getTokens()
  }
  getBackupId() {}
  async loadBackup(walletId) {
    const { drive, getBackupId } = this
    const fileId = getBackupId(walletId)
    if (fileId) {
      const backup = await drive.downloadToBuffer(fileId)
      return backup
    }
    return null
  }

  async saveBackup(walletId, fileId, backup) {
    const backupExists = async () => {
      try {
        await drive.getFileInfo(fileId)
        return true
      } catch (e) {
        return false
      }
    }
    const { drive } = this
    // if fileId is provded and backup exists - update it
    if (fileId && (await backupExists())) {
      await drive.updateFromBuffer(fileId, backup)
      return fileId
    } else {
      // create new file
      const { id } = await drive.uploadFromBuffer(walletId, backup)
      return id
    }
  }

  get name() {
    return 'gdrive'
  }
}
// singleton backup service

let backupService

export default function getBackupService() {
  if (!backupService) {
    backupService = new BackupService()
  }

  return backupService
}
