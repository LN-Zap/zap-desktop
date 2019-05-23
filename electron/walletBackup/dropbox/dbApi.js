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

export async function downloadToBuffer(dbx, path) {
  const { fileBinary } = await dbx.filesDownload({ path })
  return fileBinary
}

export function uploadFromBuffer(dbx, path, buffer, mode = 'overwrite') {
  return dbx.filesUpload({ path, contents: buffer, mode })
}

/**
 * Returns list of files metadata
 *
 * @export
 * @param {*} drive
 * @param {*} [params={}] {path, cursor} query params
 * @returns {Array}
 */
export async function listFiles(dbx, params = {}) {
  const { path = '', cursor, ...rest } = params
  if (cursor) {
    return await dbx.filesListFolder({ path, cursor, ...rest })
  }
  return await dbx.filesListFolder({ path, ...rest })
}

export function createAuthWindow(clientId, redirectUrl) {
  const authWindow = new BrowserWindow({
    width: 500,
    height: 600,
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
