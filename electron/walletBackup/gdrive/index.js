import config from 'config'

import chainify from '@zap/utils/chainify'
import { mainLog } from '@zap/utils/log'

import TokenBasedBackupService from '../base/TokenBasedBackupService'
import createClient from './gdrive'

export default class BackupService extends TokenBasedBackupService {
  /**
   * init - Setups gdrive service for usage. This method must be called before calling any other methods
   *
   * @param {object} tokens google api compliant token desc
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

  /**
   * findBackupId - Searches for an existing backup file id for the specified `walletId`.
   *
   * @param {string} walletId Wallet id
   * @returns {Promise<string>} promise that resolves to fileId or null if backup
   * was not found
   * @memberof BackupService
   */
  async findBackupId(walletId) {
    const { connection } = this
    if (connection) {
      // returns the most recent file in specified `parentId` folder
      const firstChild = async parentId => {
        const {
          data: { files },
        } = await connection.listFiles({
          orderBy: 'modifiedTime desc',
          fields: 'files(id,name, parents)',
          q: `'${parentId}' in parents and name='${config.backup.filename}'`,
          pageSize: 1,
        })
        return files
      }

      // locate backup folder first
      const searchParams = {
        orderBy: 'modifiedTime desc',
        fields: 'files(id, name, modifiedTime, size)',
        q: `name='${walletId}'`,
        pageSize: 1,
      }

      const {
        data: { files: folders = [] },
      } = await connection.listFiles(searchParams)

      // use parent folder id to find the file
      const [{ id: parentId } = {}] = folders
      const files = parentId && (await firstChild(parentId))

      if (files && files.length) {
        const [backupFile] = files
        return backupFile.id
      }
    }
    return null
  }

  /**
   * findBackup - Searches for an existing backup file for the specified `walletId`.
   *
   * @param {string} walletId Wallet id
   * @returns {Promise<Buffer>} promise that resolves to backup buffer or null if backup
   * was not found
   * @memberof BackupService
   */
  async findBackup(walletId) {
    const fileId = await this.findBackupId(walletId)
    return fileId && super.loadBackup(fileId)
  }

  /**
   * loadBackup - Loads backup for the specified wallet.
   *
   * @param {string} walletId Wallet Id
   * @returns {Buffer} Wallet backup as a `Buffer`
   * @memberof BackupService
   */
  async loadBackup({ walletId }) {
    return this.findBackup(walletId)
  }

  /**
   * Saves specified backup
   *
   * @param {string} walletId desired file name
   * @param {string} fileId google drive fileID
   * @param {Buffer} backup `Buffer` with backup data
   * @returns {string|null} google drive fileID
   * @memberof BackupService
   */
  saveBackup = chainify(async ({ walletId, locationHint, backup }) => {
    const { connection } = this

    const backupExists = async id => {
      try {
        if (!id) {
          return false
        }
        await connection.getFileInfo(id)
        return true
      } catch (e) {
        return false
      }
    }
    // if locationHint is not set or file it's pointing to doesn't exist,
    // try to find potentially existing backup file
    const fileId = (await backupExists(locationHint))
      ? locationHint
      : await this.findBackupId(walletId)

    if (connection) {
      // if fileId is provided and backup exists - update it
      if (fileId) {
        await connection.updateFromBuffer(fileId, backup)
        return fileId
      }
      // create new folder
      const { id: folderId } = await connection.createFolder(walletId)
      // create new file
      const { id } = await connection.uploadFromBuffer(config.backup.filename, backup, {
        parents: [folderId],
      })
      return id
    }

    mainLog.warn('Attempting to call saveBackup in logged-out state')
    return null
  })

  // Define the name of this backup service.
  // eslint-disable-next-line class-methods-use-this
  get name() {
    return 'gdrive'
  }
}
