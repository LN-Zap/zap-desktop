import fs from 'fs'
import { promisify } from 'util'
import chainify from '@zap/utils/chainify'

const writeFileAsync = promisify(fs.writeFile)

class BackupService {
  terminate() {
    // no-op
  }

  init() {
    // no-op
  }

  isLoggedIn() {
    return true
  }

  /**
   * Saves specified backup
   *
   * @param {string} walletId backup dir path
   * @param {string} dir relative  file path
   * @param {Buffer} backup `Buffer` with backup data
   * @returns {string}  file name
   * @memberof BackupService
   */
  saveBackup = chainify(async ({ walletId, fileId: dir, backup }) => {
    const filePath = `${dir}/${walletId}`
    await writeFileAsync(filePath, backup)
    return dir
  })

  /**
   * Provider name
   *
   * @readonly
   * @memberof BackupService
   */
  get name() {
    return 'local'
  }

  /**
   * This service doesn't use tokens and doesn't emit token events
   *
   * @readonly
   * @memberof BackupService
   */
  get isUsingTokens() {
    return false
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
