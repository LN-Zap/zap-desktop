import config from 'config'

import chainify from '@zap/utils/chainify'
import { mainLog } from '@zap/utils/log'

import TokenBasedBackupService from '../base/TokenBasedBackupService'
import createClient from './db'

const resolveBackupPath = walletId => `/${walletId}/${config.backup.filename}`

export default class BackupService extends TokenBasedBackupService {
  /**
   * init - Sets up dropbox service for usage. This method must be called before calling any other methods.
   *
   * @param {object} tokens google api compliant token desc
   * `{access_token,expiry_date,refresh_token,scope,token_type}`
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

  /**
   * loadBackup - Loads backup for the specified wallet.
   *
   * @param {string} walletId Wallet Id
   * @returns {Buffer} Wallet backup as a `Buffer`
   * @memberof BackupService
   */
  async loadBackup({ walletId }) {
    return super.loadBackup(resolveBackupPath(walletId))
  }

  /**
   * saveBackup - Saves specified backup.
   *
   * @param {string} walletId desired file name
   * @param {Buffer} backup `Buffer` with backup data
   * @returns {string|null} google drive fileID
   * @memberof BackupService
   */
  saveBackup = chainify(async ({ walletId, backup }) => {
    const { connection } = this
    if (connection) {
      const { id } = await connection.uploadFromBuffer(resolveBackupPath(walletId), backup)
      return id
    }
    mainLog.warn('Attempting to call saveBackup in logged-out state')
    return null
  })

  // Define the name of this backup service.
  get name() {
    return 'dropbox'
  }
}
