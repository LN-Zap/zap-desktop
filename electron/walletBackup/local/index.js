import fs from 'fs'
import { promisify } from 'util'
import chainify from '@zap/utils/chainify'

const writeFileAsync = promisify(fs.writeFile)

export default class BackupService {
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
   * Loads backup for the specified wallet
   *
   * @param {string} walletId
   * @returns {Buffer} wallet backup as a `Buffer`
   * @memberof BackupService
   */
  async loadBackup({ walletId, fileId: dir }) {
    const filePath = `${dir}/${walletId}`
    return Promise.resolve(fs.readFileSync(filePath))
  }

  /**
   * Saves specified backup
   *
   * @param {string} walletId backup dir path
   * @param {string} dir relative file path
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
