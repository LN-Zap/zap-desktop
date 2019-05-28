import { BrowserWindow } from 'electron'

import { google } from 'googleapis'
import { parse } from 'url'
import { Readable } from 'stream'

function createAuthUrl({ oAuthClient, scope }) {
  return oAuthClient.generateAuthUrl({
    response_type: 'code',
    access_type: 'offline',
    scope,
  })
}

function bufferToStream(buffer) {
  const readable = new Readable()
  readable._read = () => {} // _read is required but you can noop it
  readable.push(buffer)
  readable.push(null)
  return readable
}

export function createOAuthClient(clientId, redirectUrl) {
  return new google.auth.OAuth2(clientId, null, redirectUrl)
}

/**
 *
 * Updates existing file from buffer
 * @export
 * @param {Object} drive drive instance
 * @param {string} fileId google drive file id
 * @param {Buffer} buffer `Buffer` instance
 * @returns {Object}
 */
export async function updateFromBuffer(drive, fileId, buffer) {
  const res = await drive.files.update({
    fileId,
    media: {
      body: bufferToStream(buffer),
    },
  })
  return res.data
}

/**
 * Creates new file from buffer
 *
 * @export
 * @param {Object} drive drive instance
 * @param {string} name desired file name
 * @param {Buffer} buffer `Buffer` instance
 * @returns {Object}
 */
export async function uploadFromBuffer(drive, name, buffer) {
  const res = await drive.files.create({
    requestBody: {
      name,
    },
    media: {
      body: bufferToStream(buffer),
    },
  })
  return res.data
}

/**
 * Retrieves file metadata
 *
 * @export
 * @param {*} drive drive instance
 * @param {*} fileId google drive file id
 * @returns
 */
export async function getFileInfo(drive, fileId) {
  const res = await drive.files.get({
    fileId,
  })
  return res.data
}

/**
 * Downloads specified file as a `Buffer`
 *
 * @export
 * @param {*} drive drive instance
 * @param {*} fileId google drive file id
 * @returns {Buffer}
 */
export function downloadToBuffer(drive, fileId) {
  return new Promise(async (resolve, reject) => {
    try {
      const chunks = []
      const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
      res.data
        .on('end', () => {
          const result = Buffer.concat(chunks)
          resolve(result)
        })
        .on('error', err => {
          reject(err)
        })
        .on('data', d => {
          chunks.push(d)
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Returns list of files metadata
 *
 * @export
 * @param {*} drive
 * @param {*} [params={}] query params
 * @returns {Array}
 */
export async function listFiles(drive, params = {}) {
  const { pageToken, fields = 'nextPageToken, files(id, name)', pageSize = 10 } = params
  return await drive.files.list({
    pageSize,
    pageToken,
    fields,
  })
}

/**
 * Initiates user authentication procedure via google OAuth2
 *
 * @export
 * @param {Object} oAuthClient googleapis OAuth2 client
 * @param {string} scope google drive access scope
 * @param {Object} [windowParams={ width: 500, height: 600 }] Electron browser window properties
 * @returns
 */
export function createAuthWindow(oAuthClient, scope, windowParams = { width: 500, height: 600 }) {
  const authWindow = new BrowserWindow({
    ...windowParams,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const authUrl = createAuthUrl({
    oAuthClient,
    scope,
  })

  return new Promise((resolve, reject) => {
    const handleNavigation = url => {
      const { query } = parse(url, true)
      if (query) {
        if (query.error) {
          reject(new Error(`There was an error: ${query.error}`))
        } else if (query.code) {
          // Login is complete
          authWindow.removeAllListeners('closed')
          //close window
          setImmediate(() => authWindow.close())
          // Authorization that allows to request tokens
          resolve(query.code)
        }
      }
    }
    authWindow.on('closed', () => {
      reject('cancelled')
    })

    authWindow.webContents.on('will-navigate', (event, url) => {
      handleNavigation(url)
    })

    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      handleNavigation(newUrl)
    })

    authWindow.loadURL(authUrl)
  })
}

/**
 * Converts auth code to access tokens
 *
 * @export
 * @param {*} oAuthClient google OAuth2 client instance
 * @param {*} code auth code obtained through user authorization process
 * @returns
 */
export async function fetchAccessTokens(oAuthClient, code) {
  const { tokens } = await oAuthClient.getToken(code)
  return tokens
}
