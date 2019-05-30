import config from 'config'
import chainify from '@zap/utils/chainify'
import { mainLog } from '@zap/utils/log'
import TokenBasedBackupService from '../base/TokenBasedBackupService'
import createClient from './db'

export default class BackupService extends TokenBasedBackupService {
  /**
   * Sets up dropbox  service for usage. This method must be called before calling any other methods
   *
   * @param {object} tokens google api compliant token desc
   * `{access_token,expiry_date,refresh_token,scope,token_type}`
   * @returns
   * @memberof BackupService
   */
  async init(tokens) {
    const { redirectUrl, clientId } = config.backup.dropbox
    await super.init(
      createClient.bind(null, {
        clientId,
        authRedirectUrl: redirectUrl,
        tokens,
      })
    )
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
    const { connection, getBackupId } = this
    const fileId = getBackupId(walletId)
    if (fileId) {
      const backup = await connection.downloadToBuffer(fileId)
      return backup
    }
    return null
  }

  /**
   * Saves specified backup
   *
   * @param {string} walletId desired file name
   * @param {Buffer} backup `Buffer` with backup data
   * @returns {string} google drive fileID
   * @memberof BackupService
   */
  saveBackup = chainify(async ({ walletId, backup }) => {
    const { connection } = this
    if (connection) {
      const { id } = await connection.uploadFromBuffer(`/${walletId}`, backup)
      return id
    } else {
      mainLog.warn('Attempting to call saveBackup in logged-out state')
    }
  })

  /**
   * Provider name
   *
   * @readonly
   * @memberof BackupService
   */
  get name() {
    return 'dropbox'
  }
}
