import EventEmitter from 'events'
import { forwardEvent } from '@zap/utils/events'

export default class TokenBasedBackupService extends EventEmitter {
  connection = null

  /**
   *
   *
   * @param {function} createClient
   * @memberof TokenBasedBackupService
   */
  async init(createClient) {
    const { connection } = this
    if (!connection) {
      this.connection = await createClient()
      forwardEvent(this.connection, 'tokensReceived', this)
    }
  }

  /**
   * Cleans up current login. Should be called as a cleanup or before calling `init` with another credentials
   *
   * @memberof BackupService
   */
  async terminate() {
    const { connection } = this
    connection && connection.removeAllListeners('tokensReceived')
    this.connection = null
  }

  /**
   * Checks if client is setup for interactions. Also tests tokens for validity
   *
   * @returns
   * @memberof BackupService
   */
  async isLoggedIn() {
    const { connection } = this
    return connection && (await connection.testConnection())
  }

  /**
   * Returns current access tokens
   *
   * @returns {Object} current tokens object or null if not logged in
   * @memberof BackupService
   */
  getTokens() {
    const { connection } = this
    return connection && connection.getTokens()
  }

  /**
   * This service is token based and requires tokens to operate
   * It also emits `tokensReceived` event
   */
  get isUsingTokens() {
    return true
  }
}
