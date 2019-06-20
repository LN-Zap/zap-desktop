import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import chainify from '@zap/utils/chainify'
import config from 'config'

const mkdirAsync = promisify(fs.mkdir)
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
  async loadBackup({ walletId, locationHint: dir }) {
    const filePath = path.join(dir, walletId, config.backup.filename)
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
  saveBackup = chainify(async ({ walletId, locationHint: dir, backup }) => {
    const filePath = path.join(dir, walletId)
    await mkdirAsync(filePath, { recursive: true })
    await writeFileAsync(path.join(filePath, config.backup.filename), backup)
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

/**
 *
 *
 * @export
 * @param {*} nodePub
 * @param {*} dir
 * @returns
 */
export function normalizeBackupDir(nodePub, dir) {
  // use parent dir if the child dir (which is named `nodePub`) is selected as backup root
  // to avoid recursion
  if (dir.indexOf(nodePub) >= 0) {
    return path.join(dir, '..')
  }

  return dir
}
