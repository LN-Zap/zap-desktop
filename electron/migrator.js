import { writeFile, readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { app } from 'electron'
import migration_1 from './migrations/purge-local-wallets'

const fsWriteFile = promisify(writeFile)
const fsReadFile = promisify(readFile)

/**
 * @class ZapMigrator
 *
 * The ZapMigrator class finds and runds pending migrations.
 */
class ZapMigrator {
  /**
   * Registry of migration scripts.
   */
  allMigrations() {
    return [
      {
        id: 1,
        up: migration_1,
      },
    ]
  }

  /**
   * Path to migration log file.
   */
  logFile() {
    return join(app.getPath('userData'), 'last-migration.json')
  }

  /**
   * Run all pending migration scripts.
   */
  async up() {
    const migrations = await this.checkForMigrations()
    for (const migration of migrations) {
      await migration.up()
      await this.setLastMigration(migration.id)
    }
  }

  /**
   * Check for all pending migrations.
   */
  async checkForMigrations() {
    const lastMigration = await this.getLastMigration()
    return lastMigration
      ? this.allMigrations().filter(migration => migration.id > lastMigration.id)
      : this.allMigrations()
  }

  /**
   * Fetch details of the last migration tha successfully ran.
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
   * Save details of the last migration tha successfully ran.
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
