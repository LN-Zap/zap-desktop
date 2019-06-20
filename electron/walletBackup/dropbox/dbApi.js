import { BrowserWindow } from 'electron'
import fetch from 'node-fetch'
import { Dropbox } from 'dropbox/lib'
import { parse } from 'url'
import parseUrlFragments from '@zap/utils/parseUrlFragments'

function createAuthUrl(clientId, redirectUrl) {
  const dbx = new Dropbox({ clientId, fetch })
  return dbx.getAuthenticationUrl(redirectUrl)
}

/**
 * Retrieves file metadata
 *
 * @export
 * @param {*} drive  drive instance
 * @param {*} path dropbox file name
 * @returns
 */
export function getFileInfo(dbx, path) {
  return dbx.filesGetMetadata({ path })
}

/**
 * Downloads specified file as a `Buffer`
 *
 * @export
 * @param {object} dbx dropbox instance
 * @param {string} path path to file
 * @returns {Buffer}
 */
export async function downloadToBuffer(dbx, path) {
  const { fileBinary } = await dbx.filesDownload({ path })
  return fileBinary
}

/**
 * Creates new file from buffer
 *
 * @export
 * @param {object} dbx dropbox instance
 * @param {string} path path to file
 * @param {Buffer} buffer `Buffer` instance
 * @param {string} mode file write mode
 * @returns {object}
 */
export function uploadFromBuffer(dbx, path, buffer, mode = 'overwrite') {
  return dbx.filesUpload({ path, contents: buffer, mode })
}

/**
 * Returns list of files metadata
 *
 * @export
 * @param {object} dbx dropbox instance
 * @param {*} [params={}] {path, cursor,...} query params
 * @returns {Array}
 */
export async function listFiles(dbx, params = {}) {
  const { path = '', cursor, ...rest } = params
  if (cursor) {
    return await dbx.filesListFolder({ path, cursor, ...rest })
  }
  return await dbx.filesListFolder({ path, ...rest })
}

/**
 * createAuthWindow - Initiates user authentication procedure via dropbox OAuth2 implicit mode.
 *
 * @export
 * @param {string} clientId dropbox client id
 * @param {string} redirectUrl redirect url registered with the specified client id
 * @param {object} [windowParams={ width: 700, height: 700 }] Electron browser window properties
 * @returns {object} tokens object if operations was successful or error otherwise
 */
export function createAuthWindow(
  clientId,
  redirectUrl,
  windowParams = { width: 700, height: 700 }
) {
  const authWindow = new BrowserWindow({
    ...windowParams,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const authUrl = createAuthUrl(clientId, redirectUrl)

  return new Promise((resolve, reject) => {
    const handleNavigation = url => {
      const { hash, query } = parse(url, true)
      if (query && query.error) {
        return reject(new Error(`There was an error: ${query.error}`))
      }
      // hash is set and actually contains fragments
      if (hash && hash.length > 1) {
        // Login is complete
        authWindow.removeAllListeners('closed')
        //close window
        setImmediate(() => authWindow.close())
        // retrieve access tokens
        resolve(parseUrlFragments(hash))
      }
    }
    authWindow.on('closed', () => {
      reject('cancelled')
    })

    authWindow.webContents.on('will-navigate', (event, url) => {
      handleNavigation(url)
    })
    authWindow.webContents.on('did-redirect-navigation', (event, url) => {
      handleNavigation(url)
    })

    authWindow.loadURL(authUrl)
  })
}
