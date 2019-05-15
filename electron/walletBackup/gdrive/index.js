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

  /**
   * Cleans up current login. Should be called as a cleanup or before calling `login` with another credentials
   *
   * @memberof BackupService
   */
  async logout() {
    const { drive } = this
    drive && drive.removeAllListeners('tokensReceived')
    this.drive = null
  }

  /**
   * Setups gdrive service for usage. This method must be called before calling any other methods
   *
   * @param {Object} tokens google api compliant token desc
   * `{access_token,expiry_date,refresh_token,scope,token_type}`
   * @returns
   * @memberof BackupService
   */
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
  }

  /**
   * Checks if client is setup for interactions. Also tests tokens for validity
   *
   * @returns
   * @memberof BackupService
   */
  async isLoggedIn() {
    const { drive } = this
    return drive && (await drive.testConnection())
  }

  /**
   * Returns current access tokens
   *
   * @returns {Object} current tokens object or null if not logged in
   * @memberof BackupService
   */
  getTokens() {
    const { drive } = this
    return drive && drive.getTokens()
  }

  getBackupId() {
    throw new Error('Not implemented')
  }

  /**
   * Loads backup for the specified wallet
   *
   * @param {string} walletId
   * @returns {Buffer} wallet backup as a `Buffer`
   * @memberof BackupService
   */
  async loadBackup(walletId) {
    const { drive, getBackupId } = this
    const fileId = getBackupId(walletId)
    if (fileId) {
      const backup = await drive.downloadToBuffer(fileId)
      return backup
    }
    return null
  }

  /**
   * Saves specified backup
   *
   * @param {string} walletId desired file name
   * @param {string} fileId google drive fileID
   * @param {Buffer} backup `Buffer` with backup data
   * @returns {string} google drive fileID
   * @memberof BackupService
   */
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
    if (drive) {
      // if fileId is provded and backup exists - update it
      if (fileId && (await backupExists())) {
        await drive.updateFromBuffer(fileId, backup)
        return fileId
      } else {
        // create new file
        const { id } = await drive.uploadFromBuffer(walletId, backup)
        return id
      }
    } else {
      mainLog.warn('Attempting to call saveBackup in logged-out state')
    }
  }

  /**
   * Provider name
   *
   * @readonly
   * @memberof BackupService
   */
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
