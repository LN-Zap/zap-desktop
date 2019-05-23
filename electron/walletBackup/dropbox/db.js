import EventEmitter from 'events'
import fetch from 'node-fetch'
import { Dropbox } from 'dropbox/lib'

import delay from '@zap/utils/delay'
import * as api from './dbApi'
/**
 * Creates dropbox api connection
 * @param {*} { clientId, authRedirectUrl, tokens }
 * @returns {Object} returns {client, accessTokens} object. `client` represents dropbox api instance
 */
async function createConnection({ clientId, authRedirectUrl, tokens }) {
  const accessTokens = tokens || (await api.createAuthWindow(clientId, authRedirectUrl))
  const client = new Dropbox({ clientId, accessToken: accessTokens.access_token, fetch })
  return { client, accessTokens }
}

/**
 *
 * @param {Object} params - client params
 * @param {string} params.clientId - dropbox client ID. Obtained through developer console
 * @param {string} params.authRedirectUrl - authorized callback URL
 * @param {string} params.tokens - existing tokens. If omitted authentication process will start on creation
 * @returns {Object} - dropbox client
 */
async function createClient({ clientId, authRedirectUrl, tokens }) {
  // provides access to basic event emitter functionality
  const emitter = new EventEmitter()
  async function postTokensReceived(tokens) {
    // schedule event posting for the next event loop iteration
    // to give listeners chance to subscribe before the first update
    await delay(0)
    emitter.emit('tokensReceived', tokens)
  }

  let { client, accessTokens } = await createConnection({ clientId, authRedirectUrl, tokens })

  postTokensReceived(accessTokens)

  /**
   * Attempts to re-create connection to get new access tokens
   */
  async function refreshAuth() {
    ;({ client, accessTokens } = await createConnection({
      clientId,
      authRedirectUrl,
    }))
    postTokensReceived(accessTokens)
  }

  /**
   * Checks if connection is healthy and client is ready to process requests
   * @returns `true` if client is ready to interact with API `false` otherwise
   */
  async function testConnection() {
    try {
      await api.listFiles(client, { limit: 1 })
      return true
    } catch (e) {
      return false
    }
  }

  // wrap api calls to catch errors that are potentially caused with
  // expired/incorrect tokens
  function apiCall(method, ...args) {
    try {
      return method.call(null, client, ...args)
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
    getFileInfo: apiCall.bind(this, api.getFileInfo),
    listFiles: apiCall.bind(this, api.listFiles),
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
  }
}

export default createClient
