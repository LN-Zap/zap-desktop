/* eslint-disable class-methods-use-this */
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import config from 'config'

import chainify from '@zap/utils/chainify'

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
   * loadBackup - Loads backup for the specified wallet.
   *
   * @param {string} walletId Wallet id
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

  // Define the name of this backup service.
  get name() {
    return 'local'
  }

  // This service doesn't use tokens and doesn't emit token events.
  get isUsingTokens() {
    return false
  }
}

/**
 * normalizeBackupDir - Normalize backup directory path.
 *
 * @param {string} nodePub Node Pubkey
 * @param {string} dir Backup directory path
 * @returns {string} Normalized backup directory
 */
export function normalizeBackupDir(nodePub, dir) {
  // use parent dir if the child dir (which is named `nodePub`) is selected as backup root
  // to avoid recursion
  if (dir.indexOf(nodePub) >= 0) {
    return path.join(dir, '..')
  }

  return dir
}
