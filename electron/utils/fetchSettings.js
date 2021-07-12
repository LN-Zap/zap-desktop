import config from 'config'
import { BrowserWindow } from 'electron'

import getDbName from '@zap/utils/db'
import { mainLog } from '@zap/utils/log'

/**
 * fetchSettings - Fetch user settings from indexedDb.
 *
 * We do this by starting up a new browser window and accessing indexedDb from within it.
 *
 * @returns {Promise<object>} Object representing the indexedDb Settings table
 */
const fetchSettings = () => {
  const win = new BrowserWindow({
    show: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
    },
  })
  if (process.env.HOT) {
    const port = process.env.PORT || 1212
    win.loadURL(`http://localhost:${port}/dist/empty.html`)
  } else {
    win.loadURL(`file://${__dirname}/empty.html`)
  }

  // Once we have fetched (or failed to fetch) the user settings, destroy the window.
  win.on('load-settings-done', () => process.nextTick(() => win.destroy()))

  const { namespace, domain } = config.db
  const { NODE_ENV: environment } = process.env
  const dbName = getDbName({
    namespace,
    domain,
    environment,
  })
  mainLog.debug(`Fetching user settings from indexedDb (using database "%s")`, dbName)

  return win.webContents
    .executeJavaScript(
      `
      new Promise((resolve, reject) => {
        var DBOpenRequest = window.indexedDB.open('${dbName}')
        DBOpenRequest.onupgradeneeded = function(event) {
          event.target.transaction.abort()
          return reject(new Error('Database does not exist'))
        }
        DBOpenRequest.onerror = function() {
          return reject(new Error('Error loading database'))
        }
        DBOpenRequest.onsuccess = function() {
          const db = DBOpenRequest.result
          var transaction = db.transaction(['settings'], 'readwrite')
          transaction.onerror = function() {
            return reject(transaction.error)
          }
          var objectStore = transaction.objectStore('settings')
          var objectStoreRequest = objectStore.getAll()
          objectStoreRequest.onsuccess = function() {
            return resolve(objectStoreRequest.result)
          }
        }
      })
    `
    )
    .then(res => {
      mainLog.debug('Got user settings: %o', res)
      win.emit('load-settings-done')
      return res
    })
    .catch(err => {
      win.emit('load-settings-done')
      throw err
    })
}

export default fetchSettings
