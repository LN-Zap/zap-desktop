import config from 'config'
import Dexie from 'dexie'

import getDbName from '@zap/utils/db'

import dbVersions from './dbVersions'
import Node from './schema/node'
import Setting from './schema/setting'
import Wallet, { hooks as walletHooks } from './schema/wallet'

/**
 * getDb - Define the database.
 *
 * @param {string} name Database name
 * @returns {object} Dexie database schema
 */
export const getDb = name => {
  const db = new Dexie(name)

  // Apply schema versions.
  dbVersions(db)

  // Apply helper classes.
  db.nodes.mapToClass(Node, Node.SCHEMA)
  db.settings.mapToClass(Setting, Setting.SCHEMA)
  db.wallets.mapToClass(Wallet, Wallet.SCHEMA)

  // Apply hooks.
  db.wallets.hook('creating', walletHooks.creating)
  db.wallets.hook('updating', walletHooks.updating)
  db.wallets.hook('reading', walletHooks.reading)

  return db
}

/**
 * initDb - Initialise the database and make it globally accessible.
 *
 * @returns {Promise} Resolves once database connection is open
 */
export const initDb = () => {
  const { namespace, domain } = config.db
  const { NODE_ENV: environment } = process.env
  const dbName = getDbName({
    namespace,
    domain,
    environment,
  })
  window.db = getDb(dbName)
  return window.db.open()
}
