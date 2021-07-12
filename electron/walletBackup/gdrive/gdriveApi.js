import { Readable } from 'stream'
import { parse } from 'url'

import { BrowserWindow } from 'electron'
import { google } from 'googleapis'

/**
 * createAuthUrl - Creates a Google Drive authentication url.
 *
 * @param {object} oAuthClient Gdrive oAuth client
 * @param {string} scope Auth scope
 * @returns {string} Gdrive authentication url
 */
function createAuthUrl(oAuthClient, scope) {
  return oAuthClient.generateAuthUrl({
    response_type: 'code',
    access_type: 'offline',
    scope,
  })
}

/**
 * bufferToStream - Convert a buffer to a readable stream.
 *
 * @param {Buffer} buffer Buffer
 * @returns {object} Readable stream
 */
function bufferToStream(buffer) {
  const readable = new Readable()
  readable._read = () => {} // _read is required but you can noop it
  readable.push(buffer)
  readable.push(null)
  return readable
}

/**
 * createOAuthClient - Creates a Google Drive authentication client.
 *
 * @param {string} clientId Google Drive client id
 * @param {string} redirectUrl Redirect url
 * @returns {string} Google Drive authentication client
 */
export function createOAuthClient(clientId, redirectUrl) {
  return new google.auth.OAuth2(clientId, null, redirectUrl)
}

/**
 *
 * updateFromBuffer - Updates existing file from buffer.
 *
 * @param {object} drive drive instance
 * @param {string} fileId google drive file id
 * @param {Buffer} buffer `Buffer` instance
 * @returns {object} Updated file info
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
 * uploadFromBuffer - Creates new file from buffer.
 *
 * @param {object} drive drive instance
 * @param {string} name desired file name
 * @param {Buffer} buffer `Buffer` instance
 * @param {object} options `Options
 * @returns {object} Fileinfo
 */
export async function uploadFromBuffer(drive, name, buffer, options = {}) {
  const res = await drive.files.create({
    requestBody: {
      name,
      ...options,
    },
    media: {
      body: bufferToStream(buffer),
    },
  })
  return res.data
}

/**
 * getFileInfo - Retrieves file metadata.
 *
 * @param {*} drive drive instance
 * @param {*} fileId google drive file id
 * @returns {object} File info
 */
export async function getFileInfo(drive, fileId) {
  const res = await drive.files.get({
    fileId,
  })
  return res.data
}

/**
 * createFolder - Creates a folder with the specified `name`.
 *
 * @param {object} drive drive instance
 * @param {string} name folder name
 * @returns {object} Folder info
 */
export async function createFolder(drive, name) {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    },
  })
  return res.data
}

/**
 * downloadToBuffer - Downloads specified file as a `Buffer`.
 *
 * @param {object} drive drive instance
 * @param {string} fileId google drive file id
 * @returns {Buffer} File data as a Buffer
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
 * listFiles - Returns list of files metadata.
 *
 * @param {object} drive drive instance
 * @param {object} params query params
 * @returns {Array} List of files
 */
export async function listFiles(drive, params = {}) {
  const { pageToken, fields = 'nextPageToken, files(id, name)', pageSize = 10, ...rest } = params
  return drive.files.list({
    pageSize,
    pageToken,
    fields,
    ...rest,
  })
}

/**
 * createAuthWindow - Initiates user authentication procedure via google OAuth2.
 *
 * @param {object} oAuthClient googleapis OAuth2 client
 * @param {string} scope google drive access scope
 * @param {object} [windowParams={ width: 500, height: 600 }] Electron browser window properties
 * @returns {Promise<string>} Authorization code that allows to request tokens
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

  const authUrl = createAuthUrl(oAuthClient, scope)

  return new Promise((resolve, reject) => {
    const handleNavigation = url => {
      const { query } = parse(url, true)
      if (query) {
        if (query.error) {
          reject(new Error(`There was an error: ${query.error}`))
        } else if (query.code) {
          // Login is complete
          authWindow.removeAllListeners('closed')
          // close window
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

    authWindow.loadURL(authUrl, { userAgent: 'Chrome' })
  })
}

/**
 * fetchAccessTokens - Converts auth code to access tokens.
 *
 * @param {object} oAuthClient google OAuth2 client instance
 * @param {string} code auth code obtained through user authorization process
 * @returns {object} Access tokens
 */
export async function fetchAccessTokens(oAuthClient, code) {
  const { tokens } = await oAuthClient.getToken(code)
  return tokens
}
