import { writeFile, readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

import { app } from 'electron'

import deleteTmpWallets from './migrations/delete-tmp-wallets'
import purgeLocalWallets from './migrations/purge-local-wallets'

const fsWriteFile = promisify(writeFile)
const fsReadFile = promisify(readFile)

/**
 * @class ZapMigrator
 *
 * The ZapMigrator class finds and runds pending migrations.
 */
class ZapMigrator {
  /**
   * allMigrations - Registry of migration scripts.
   *
   * @returns {Array} List of migrations
   */
  allMigrations() {
    return [
      {
        id: 1,
        up: purgeLocalWallets,
      },
      {
        id: 2,
        up: deleteTmpWallets,
      },
      {
        id: 3,
        up: deleteTmpWallets,
      },
      {
        id: 4,
        up: deleteTmpWallets,
      },
    ]
  }

  /**
   * logFile - Path to migration log file.
   *
   * @returns {string} Path to migration log file
   */
  logFile() {
    return join(app.getPath('userData'), 'last-migration.json')
  }

  /**
   * up - Run all pending migration scripts.
   *
   * @returns {undefined}
   */
  async up() {
    const migrations = await this.checkForMigrations()
    for (const migration of migrations) {
      await migration.up()
      await this.setLastMigration(migration.id)
    }
  }

  /**
   * checkForMigrations - Check for all pending migrations.
   *
   * @returns {Array} List of pending migrations
   */
  async checkForMigrations() {
    const lastMigration = await this.getLastMigration()
    return lastMigration
      ? this.allMigrations().filter(migration => migration.id > lastMigration.id)
      : this.allMigrations()
  }

  /**
   * getLastMigration - Fetch details of the last migration that successfully ran.
   *
   * @returns {object} Details of last migration that successfully ran
   */
  async getLastMigration() {
    try {
      const migrations = await fsReadFile(this.logFile(), 'utf8')
      return JSON.parse(migrations)
    } catch (e) {
      return null
    }
  }

  /**
   * setLastMigration - Save details of the last migration tha successfully ran.
   *
   * @param {number} id Migration Id
   * @returns {undefined}
   */
  async setLastMigration(id) {
    const data = {
      id: id.toString(),
      date: new Date(),
    }
    await fsWriteFile(this.logFile(), JSON.stringify(data))
  }
}

export default ZapMigrator
