import { google } from 'googleapis'
import EventEmitter from 'events'

import { mainLog } from '@zap/utils/log'
import delay from '@zap/utils/delay'
import * as api from './gdriveApi'

/**
 *Creates google drive api connection
 * @param {*} { clientId, authRedirectUrl, scope, tokens }
 * @returns {Object} returns {drive, accessTokens} object. `drive` represent google drive api instance
 */
function createConnection({ clientId, authRedirectUrl, scope, tokens }) {
  const oAuthClient = api.createOAuthClient(clientId, authRedirectUrl)
  async function createDriveInstance(tokens) {
    const result = { accessTokens: tokens }
    if (tokens) {
      oAuthClient.setCredentials(tokens)
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
 *
 * @param {Object} params - client params
 * @param {string} params.clientId - google client ID. Obtained through developer console
 * @param {string} params.authRedirectUrl - authorized callback URL
 * @param {string} params.scope - google drive permissions scope
 * @param {string} params.tokens - existing tokens. If omitted authentication process will start on creation
 * @returns {Object} - google drive client
 */
async function createClient({ clientId, authRedirectUrl, scope, tokens }) {
  // provides access to basic event emitter functionality
  const emitter = new EventEmitter()
  async function postTokensReceived(tokens) {
    // schedule event posting for the next event loop iteration
    // to give listeners chance to subscribe before the first update
    await delay(0)
    emitter.emit('tokensReceived', tokens)
  }

  let { drive, accessTokens } = await createConnection({ clientId, authRedirectUrl, scope, tokens })
  // mainLog.info('tokensReceived1')
  postTokensReceived(accessTokens)

  /**
   * Attempts to re-create connection to get new access tokens
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
   * Checks if connection is health and client is ready to process requests
   * @returns `true` if client is ready to interact with API `false` otherwise
   */
  async function testConnection() {
    try {
      await api.listFiles(drive)
      return true
    } catch (e) {
      return false
    }
  }

  // wrap api calls to catch errors that are potentially caused with
  // expired/incorrect tokens
  function apiCall(method, ...args) {
    try {
      return method.call(null, drive, ...args)
    } catch (e) {
      // try re-initializing connection
      // TODO: continue call exec ?
      refreshAuth()
    }
  }

  return {
    getTokens: () => accessTokens,
    refreshAuth,
    testConnection,
    downloadToBuffer: apiCall.bind(this, api.downloadToBuffer),
    uploadFromBuffer: apiCall.bind(this, api.uploadFromBuffer),
    updateFromBuffer: apiCall.bind(this, api.updateFromBuffer),
    getFileInfo: apiCall.bind(this, api.getFileInfo),
    listFiles: apiCall.bind(this, api.listFiles),
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
  }
}

export default createClient
