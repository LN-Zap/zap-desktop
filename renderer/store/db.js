import Dexie from 'dexie'
import encrypt from 'dexie-encrypted'
import config from 'config'
import { byteToHexString } from '@zap/utils/byteutils'
import getDbName from '@zap/utils/db'
import { mainLog } from '@zap/utils/log'
import Node from './schema/node'
import Wallet, { hooks as walletHooks } from './schema/wallet'
import Setting from './schema/setting'
import dbVersions from './dbVersions'

/**
 * setupDb - Define Zap database schema and run migrations.
 *
 * @param {Dexie} db Dexie Database instance
 * @returns {Promise<Dexie>} Active database connection
 */
export const setupDb = async db => {
  // Apply schema versions.
  await dbVersions(db)

  // Apply helper classes.
  db.nodes.mapToClass(Node, Node.SCHEMA)
  db.settings.mapToClass(Setting, Setting.SCHEMA)
  db.wallets.mapToClass(Wallet, Wallet.SCHEMA)

  // Apply hooks.
  db.wallets.hook('creating', walletHooks.creating)
  db.wallets.hook('updating', walletHooks.updating)
  db.wallets.hook('reading', walletHooks.reading)

  // Open database connection.
  return db.open()
}

/**
 * getDefaultDatabaseName - Get the default database name based in config settings.
 *
 * @returns {string} Default database name
 */
export const getDefaultDatabaseName = () => {
  const { namespace, domain } = config.db
  const { NODE_ENV: environment } = process.env
  return getDbName({ namespace, domain, environment })
}

/**
 * getDatabase - Get database.
 *
 * @returns {Promise<Dexie>} Active database connection
 */
export const getDatabase = async () => {
  const dbName = getDefaultDatabaseName()

  // Initialise database encryption schema
  try {
    mainLog.info('Initializing database encryption')
    let fakedb = new Dexie(dbName)
    encrypt(fakedb, new Uint8Array(32), {})
    fakedb = await setupDb(fakedb)
    fakedb.close()
  } catch (e) {
    mainLog.info('Database encryption already initialised')
  }

  return setupDb(new Dexie(dbName))
}

/**
 * encryptDatabase - Encrypr database `name` using encryption key `key`.
 *
 * @param  {Uint8Array}  key  Datbase encryption key
 * @returns {Promise<Dexie>} Active database connection
 */
export const encryptDatabase = async key => {
  mainLog.info('Encrypting database with key: %s', byteToHexString(key))
  const dbName = getDefaultDatabaseName()
  const db = new Dexie(dbName)
  const settings = {
    secrets: {
      type: encrypt.BLACKLIST,
      fields: ['value'],
    },
  }
  encrypt(db, key, settings)
  return setupDb(db)
}

/**
 * decryptDatabase - Decrypt database `name` using encryption key `key`.
 *
 * @param  {Uint8Array}  key  Datbase encryption key
 * @returns {Promise<Dexie>} Active database connection
 */
export const decryptDatabase = async key => {
  mainLog.info('Decrypting database with key: %s', byteToHexString(key))
  const dbName = getDefaultDatabaseName()
  const db = new Dexie(dbName)
  encrypt(db, key, {})
  return setupDb(db)
}

/**
 * initDb - Initialise the database and make it globally accessible.
 *
 * @param  {object}  params Options
 * @param  {Uint8Array}  params.oldKey  Existing datbase encryption key
 * @param  {Uint8Array}  params.newKey  New database encryption key
 * @returns {Promise} Resolves once database connection is open
 */
export const initDb = async ({ oldKey, newKey } = {}) => {
  mainLog.info('Initializing database:')
  mainLog.info(' - oldKey: %s', byteToHexString(oldKey))
  mainLog.info(' - newKey: %s', byteToHexString(newKey))

  let db

  const finalize = () => {
    window.db = db
    return window.db
  }

  // If no keys have been supplied, return unencrypted database.
  if (!oldKey && !newKey) {
    db = getDatabase()
    return finalize()
  }

  // If the keys match just unencrypt the database.
  if (oldKey === newKey) {
    db = await encryptDatabase(newKey)
    return finalize()
  }

  // If an old key has been supplied use this to decrypt the database.
  if (oldKey) {
    db = await decryptDatabase(oldKey)
  }

  // If a new key has been supplied use this to re-encrypt the database.
  if (newKey) {
    db = await encryptDatabase(newKey)
  }

  return finalize()
}
