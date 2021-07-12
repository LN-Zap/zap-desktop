import { parse } from 'url'

import { Dropbox } from 'dropbox/lib'
import { BrowserWindow } from 'electron'
import fetch from 'node-fetch'

import parseUrlFragments from '@zap/utils/parseUrlFragments'

/**
 * createAuthUrl - Creates a dropbox authentication url.
 *
 * @param {string} clientId Dropbox client id
 * @param {string} redirectUrl Redirect url
 * @returns {string} Dropbox authentication url
 */
function createAuthUrl(clientId, redirectUrl) {
  const dbx = new Dropbox({ clientId, fetch })
  return dbx.getAuthenticationUrl(redirectUrl)
}

/**
 * getFileInfo - Retrieves file metadata.
 *
 * @param {object} dbx  Drive instance
 * @param {string} path Dropbox file name
 * @returns {object} File info
 */
export function getFileInfo(dbx, path) {
  return dbx.filesGetMetadata({ path })
}

/**
 * downloadToBuffer - Downloads specified file as a `Buffer`.
 *
 * @param {object} dbx Dropbox instance
 * @param {string} path Path to file
 * @returns {Buffer} File data
 */
export async function downloadToBuffer(dbx, path) {
  const { fileBinary } = await dbx.filesDownload({ path })
  return fileBinary
}

/**
 * uploadFromBuffer - Creates new file from buffer.
 *
 * @param {object} dbx dropbox instance
 * @param {string} path path to file
 * @param {Buffer} buffer `Buffer` instance
 * @param {string} mode file write mode
 * @returns {object} File info
 */
export function uploadFromBuffer(dbx, path, buffer, mode = 'overwrite') {
  return dbx.filesUpload({ path, contents: buffer, mode })
}

/**
 * listFiles - Returns list of files metadata.
 *
 * @param {object} dbx dropbox instance
 * @param {*} [params={}] {path, cursor,...} query params
 * @returns {Array} File listing
 */
export async function listFiles(dbx, params = {}) {
  const { path = '', cursor, ...rest } = params
  if (cursor) {
    return dbx.filesListFolder({ path, cursor, ...rest })
  }
  return dbx.filesListFolder({ path, ...rest })
}

/**
 * createAuthWindow - Initiates user authentication procedure via dropbox OAuth2 implicit mode.
 *
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
        // close window
        setImmediate(() => authWindow.close())
        // retrieve access tokens
        return resolve(parseUrlFragments(hash))
      }

      return null
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
