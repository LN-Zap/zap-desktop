import EventEmitter from 'events'

import { google } from 'googleapis'

import delay from '@zap/utils/delay'
import { mainLog } from '@zap/utils/log'

import * as api from './gdriveApi'

/**
 * createConnection - Creates google drive api connection.
 *
 * @param {*} { clientId, authRedirectUrl, scope, tokens }
 * @returns {object} returns {drive, accessTokens} object. `drive` represents google drive api instance
 */
function createConnection({ clientId, authRedirectUrl, scope, tokens }) {
  const oAuthClient = api.createOAuthClient(clientId, authRedirectUrl)

  /**
   * createDriveInstance - Create gdrive api connection.
   *
   * @param {object} gDriveTokens Tokens
   * @returns {object} Gdrive api connection
   */
  async function createDriveInstance(gDriveTokens) {
    const result = { accessTokens: gDriveTokens }
    if (gDriveTokens) {
      oAuthClient.setCredentials(gDriveTokens)
    } else {
      const code = await api.createAuthWindow(oAuthClient, scope)
      const accessTokens = await api.fetchAccessTokens(oAuthClient, code)
      mainLog.info('received gdrive tokens')
      mainLog.info(accessTokens)
      oAuthClient.setCredentials(accessTokens)
      result.accessTokens = accessTokens
    }
    result.drive = google.drive({ version: 'v3', auth: oAuthClient })
    return result
  }

  return createDriveInstance(tokens)
}

/**
 * createClient - Creates gdrive api client.
 *
 * @param {object} params - client params
 * @param {string} params.clientId - google client ID. Obtained through developer console
 * @param {string} params.authRedirectUrl - authorized callback URL
 * @param {string} params.scope - google drive permissions scope
 * @param {string} params.tokens - existing tokens. If omitted authentication process will start on creation
 * @returns {object} - google drive client
 */
async function createClient({ clientId, authRedirectUrl, scope, tokens }) {
  // provides access to basic event emitter functionality
  const emitter = new EventEmitter()

  /**
   * postTokensReceived - Emit `tokensReceived` after tokens have been received.
   *
   * @param {object} tokens Tokens
   */
  async function postTokensReceived(tokens) {
    // schedule event posting for the next event loop iteration
    // to give listeners chance to subscribe before the first update
    await delay(0)
    emitter.emit('tokensReceived', tokens)
  }

  const connection = await createConnection({ clientId, authRedirectUrl, scope, tokens })
  const { accessTokens } = connection
  let { drive } = connection
  postTokensReceived(accessTokens)

  /**
   * refreshAuth - Attempts to re-create connection to get new access tokens.
   */
  async function refreshAuth() {
    const { drive: client, accessTokens } = await createConnection({
      clientId,
      authRedirectUrl,
      scope,
    })
    drive = client
    postTokensReceived(accessTokens)
  }

  /**
   * testConnection - Checks if connection is healthy and client is ready to process requests.
   *
   * @returns {boolean} `true` if client is ready to interact with API `false` otherwise
   */
  async function testConnection() {
    try {
      await api.listFiles(drive, { pageSize: 1 })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * apiCall - Wrap api calls to catch errors that are potentially caused with expired/incorrect tokens.
   *
   * @param {Function} method Method to call
   * @param {...object} args Additional arguments to pass to call the method with
   * @returns {any} Result of calling the api method
   */
  function apiCall(method, ...args) {
    try {
      return method.call(null, drive, ...args)
    } catch (e) {
      // try re-initializing connection
      // TODO: continue call exec ?
      refreshAuth()
      return null
    }
  }

  return {
    getTokens: () => accessTokens,
    refreshAuth,
    testConnection,
    downloadToBuffer: apiCall.bind(this, api.downloadToBuffer),
    uploadFromBuffer: apiCall.bind(this, api.uploadFromBuffer),
    updateFromBuffer: apiCall.bind(this, api.updateFromBuffer),
    createFolder: apiCall.bind(this, api.createFolder),
    getFileInfo: apiCall.bind(this, api.getFileInfo),
    listFiles: apiCall.bind(this, api.listFiles),
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
  }
}

export default createClient
