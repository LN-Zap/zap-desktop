import config from 'config'
import chainify from '@zap/utils/chainify'
import { mainLog } from '@zap/utils/log'
import TokenBasedBackupService from '../base/TokenBasedBackupService'
import createClient from './gdrive'

export default class BackupService extends TokenBasedBackupService {
  /**
   * Setups gdrive service for usage. This method must be called before calling any other methods
   *
   * @param {Object} tokens google api compliant token desc
   * `{access_token,expiry_date,refresh_token,scope,token_type}`
   * @returns
   * @memberof BackupService
   */

  async init(tokens) {
    const { redirectUrl, scope, clientId } = config.backup.gdrive
    await super.init(
      createClient.bind(null, {
        clientId,
        authRedirectUrl: redirectUrl,
        scope,
        tokens,
      })
    )
  }

  async findBackup(walletId) {
    const { connection } = this
    if (connection) {
      const searchParams = {
        orderBy: 'modifiedTime desc',
        fields: 'files(id, name, modifiedTime, size)',
        q: `name='${walletId}'`,
        pageSize: 1,
      }
      const {
        data: { files },
      } = await connection.listFiles(searchParams)
      if (files && files.length) {
        const [backupFile] = files
        return await super.loadBackup(backupFile.id)
      }
    }
  }

  async loadBackup({ walletId }) {
    return this.findBackup(walletId)
  }

  getBackupId() {
    throw new Error('Not implemented')
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
  saveBackup = chainify(async ({ walletId, fileId, backup }) => {
    const { connection } = this
    const backupExists = async () => {
      try {
        await connection.getFileInfo(fileId)
        return true
      } catch (e) {
        return false
      }
    }

    if (connection) {
      // if fileId is provided and backup exists - update it
      if (fileId && (await backupExists())) {
        await connection.updateFromBuffer(fileId, backup)
        return fileId
      } else {
        // create new file
        const { id } = await connection.uploadFromBuffer(walletId, backup)
        return id
      }
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
    return 'gdrive'
  }
}
