import EventEmitter from 'events'

import { Dropbox } from 'dropbox/lib'
import fetch from 'node-fetch'

import delay from '@zap/utils/delay'

import * as api from './dbApi'

/**
 * createConnection - Creates dropbox api connection.
 *
 * @param {*} { clientId, authRedirectUrl, tokens }
 * @returns {object} returns {client, accessTokens} object. `client` represents dropbox api instance
 */
async function createConnection({ clientId, authRedirectUrl, tokens }) {
  const accessTokens = tokens || (await api.createAuthWindow(clientId, authRedirectUrl))
  const client = new Dropbox({ clientId, accessToken: accessTokens.access_token, fetch })
  return { client, accessTokens }
}

/**
 * createClient - Creates dropbox api client.
 *
 * @param {object} params - client params
 * @param {string} params.clientId - dropbox client ID. Obtained through developer console
 * @param {string} params.authRedirectUrl - authorized callback URL
 * @param {string} params.tokens - existing tokens. If omitted authentication process will start on creation
 * @returns {object} - dropbox client
 */
async function createClient({ clientId, authRedirectUrl, tokens }) {
  // provides access to basic event emitter functionality
  const emitter = new EventEmitter()

  /**
   * postTokensReceived - Emit `tokensReceived` after tokens have been received.
   *
   * @param {object} tokensReceived Tokens
   */
  async function postTokensReceived(tokensReceived) {
    // schedule event posting for the next event loop iteration
    // to give listeners chance to subscribe before the first update
    await delay(0)
    emitter.emit('tokensReceived', tokensReceived)
  }

  let { client, accessTokens } = await createConnection({ clientId, authRedirectUrl, tokens })
  postTokensReceived(accessTokens)

  /**
   * refreshAuth - Attempts to re-create connection to get new access tokens.
   */
  async function refreshAuth() {
    ;({ client, accessTokens } = await createConnection({
      clientId,
      authRedirectUrl,
    }))
    postTokensReceived(accessTokens)
  }

  /**
   * testConnection - Checks if connection is healthy and client is ready to process requests.
   *
   * @returns {boolean} `true` if client is ready to interact with API `false` otherwise
   */
  async function testConnection() {
    try {
      await api.listFiles(client, { limit: 1 })
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
      return method.call(null, client, ...args)
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
    getFileInfo: apiCall.bind(this, api.getFileInfo),
    listFiles: apiCall.bind(this, api.listFiles),
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
  }
}

export default createClient
