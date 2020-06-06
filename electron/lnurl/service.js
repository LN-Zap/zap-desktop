import { ipcMain } from 'electron'
import { parse } from 'url'
import {
  fetchLnurlParams,
  makeAuthRequest,
  makeChannelRequest,
  makeWithdrawRequest,
  LNURL_STATUS_ERROR,
} from '@zap/utils/lnurl'
import { mainLog } from '@zap/utils/log'

/**
 * getServiceName - Formats `url` as a service name.
 *
 * @param {string} url service url
 * @returns {string} service name or '' if decoding has failed
 */
const getServiceName = url => {
  try {
    return parse(url).hostname
  } catch (e) {
    return ''
  }
}

/*
 * Lnurl handler class. Allows to process lnurl withdrawal request.
 */
export default class LnurlService {
  constructor(mainWindow) {
    this.mainWindow = mainWindow

    this.withdrawParams = {}
    this.isWithdrawProcessing = false

    this.channelParams = {}
    this.isChannelProcessing = false

    this.authParams = {}
    this.isAuthProcessing = false

    ipcMain.on('lnurlFinishWithdraw', this.onFinishWithdraw)
    ipcMain.on('lnurlCancelWithdraw', this.onCancelWithdraw)

    ipcMain.on('lnurlFinishChannel', this.onFinishChannel)
    ipcMain.on('lnurlCancelChannel', this.onCancelChannel)

    ipcMain.on('lnurlFinishAuth', this.onFinishAuth)
    ipcMain.on('lnurlCancelAuth', this.onCancelAuth)
  }

  /**
   * terminate - De-initializer routine. Must be called when particular
   * `LnurlService` instance is of no use anymore.
   */
  terminate() {
    ipcMain.off('lnurlFinishWithdraw', this.onFinishWithdraw)
    ipcMain.off('lnurlCancelWithdraw', this.onCancelWithdraw)

    ipcMain.off('lnurlFinishChannel', this.onFinishChannel)
    ipcMain.off('lnurlCancelChannel', this.onCancelChannel)

    ipcMain.off('lnurlFinishAuth', this.onFinishAuth)
    ipcMain.off('lnurlCancelAuth', this.onCancelAuth)
  }

  /**
   * sendMessage - Send a message to the main window.
   *
   * @param {string} msg message to send.
   * @param {object} data additional data to accompany the message.
   */
  sendMessage(msg, data) {
    if (this.mainWindow) {
      mainLog.info('Sending message to renderer process: %o', { msg, data })
      this.mainWindow.webContents.send(msg, data)
    } else {
      mainLog.warn('Unable to send message to renderer process (main window not available): %o', {
        msg,
        data,
      })
    }
  }

  /**
   * process - Process an lnurl.
   *
   * @param {string} lnurl decoded lnurl
   */
  async process(lnurl) {
    mainLog.info('Attempting to process lnurl: %s', lnurl)
    try {
      const res = await fetchLnurlParams(lnurl)

      if (res.status === LNURL_STATUS_ERROR) {
        throw new Error(res.reason)
      }

      switch (res.tag) {
        case 'withdrawRequest':
          this.withdrawParams = res
          await this.startWithdraw(lnurl)
          break

        case 'channelRequest':
          this.channelParams = res
          await this.startChannel()
          break

        case 'authRequest':
          this.authParams = res
          await this.startAuth()
          break

        default:
          throw new Error('Unable to process lnurl')
      }
    } catch (error) {
      this.sendMessage('lnurlError', { message: error.message })
      throw error
    }
  }

  /** WITHDRAW -------------------------------------------------------------- */

  /**
   * startWithdraw - Initiates lnurl withdrawal process by sending query to
   * renderer process to generate LN invoice.
   *
   * @param {string} lnurl decoded lnurl
   */
  async startWithdraw(lnurl) {
    const { status, reason, maxWithdrawable, defaultDescription } = this.withdrawParams
    const service = getServiceName(lnurl)

    if (this.isWithdrawProcessing) {
      mainLog.warn('Error processing lnurl withdraw request: busy')
      this.sendMessage('lnurlWithdrawError', { service, reason: 'service busy' })
      return
    }
    this.isWithdrawProcessing = true

    if (status === LNURL_STATUS_ERROR) {
      const withdrawParams = { status, reason, service }
      this.isWithdrawProcessing = false
      mainLog.error('Unable to process lnurl withdraw request: %o', withdrawParams)
      this.sendMessage('lnurlWithdrawError', withdrawParams)
      return
    }

    const withdrawParams = { amount: maxWithdrawable, memo: defaultDescription, service }
    mainLog.info('Processing lnurl withdraw request: %o', withdrawParams)
    this.sendMessage('lnurlWithdrawRequest', withdrawParams)
  }

  /**
   * resetWithdraw - Resets lnurl-withdraw state.
   */
  resetWithdraw = () => {
    this.isWithdrawProcessing = false
    this.withdrawParams = {}
  }

  /**
   * onCancelWithdraw - Cancels an lnurl-withdraw request.
   */
  onCancelWithdraw = () => {
    mainLog.info('Cancelling lnurl withdrawal request: %o', this.withdrawParams)
    this.resetWithdraw()
  }

  /**
   * onFinishWithdraw - Finalizes an lnurl-withdraw request.
   *
   * @param {object} event Event
   * @param {object} data Data
   */
  onFinishWithdraw = async (event, { paymentRequest }) => {
    mainLog.info('Finishing lnurl withdraw request: %o', this.withdrawParams)
    const { callback, secret, lnurl } = this.withdrawParams
    const service = getServiceName(lnurl)
    try {
      if (callback && secret && paymentRequest) {
        const { data } = await makeWithdrawRequest({ callback, secret, invoice: paymentRequest })
        if (data.status === LNURL_STATUS_ERROR) {
          mainLog.warn('Got error from lnurl withdraw request: %o', data)
          throw new Error(data.reason)
        }

        mainLog.info('Completed withdraw request: %o', data)
        this.sendMessage('lnurlWithdrawSuccess', { service })
      }
    } catch (e) {
      mainLog.warn('Unable to complete lnurl withdraw request: %s', e.message)
      this.sendMessage('lnurlWithdrawError', { service, reason: e.message })
    } finally {
      this.resetWithdraw()
    }
  }

  /** CHANNEL --------------------------------------------------------------- */

  /**
   * startChannel - Initiates lnurl channel process by sending query to renderer
   * process to initiate channel connect.
   */
  async startChannel() {
    const { status, uri: service } = this.channelParams

    if (this.isChannelProcessing) {
      mainLog.warn('Error processing lnurl channel request: busy')
      this.sendMessage('lnurlChannelError', { service, reason: 'service busy' })
      return
    }
    this.isChannelProcessing = true

    if (status === LNURL_STATUS_ERROR) {
      const channelParams = { status, service }
      this.isChannelProcessing = false
      mainLog.error('Unable to process lnurl channel request: %o', channelParams)
      this.sendMessage('lnurlChannelError', channelParams)
      return
    }

    const channelParams = { service }
    mainLog.info('Processing lnurl channel request: %o', channelParams)
    this.sendMessage('lnurlChannelRequest', channelParams)
  }

  /**
   * resetChannel - Resets lnurl-channel state.
   */
  resetChannel = () => {
    this.isChannelProcessing = false
    this.channelParams = {}
  }

  /**
   * onCancelChannel - Cancels an lnurl-channel request.
   */
  onCancelChannel = () => {
    mainLog.info('Cancelling lnurl channel request: %o', this.channelParams)
    this.resetChannel()
  }

  /**
   * onFinishChannel - Finalizes an lnurl-channel request.
   *
   * @param {object} event Event
   * @param {object} data Data
   */
  onFinishChannel = async (event, { pubkey }) => {
    mainLog.info('Finishing lnurl channel request: %o', this.channelParams)
    const { callback, secret, uri: service } = this.channelParams
    try {
      if (callback && secret && pubkey) {
        const { data } = await makeChannelRequest({ callback, secret, pubkey, isPrivate: true })

        if (data.status === LNURL_STATUS_ERROR) {
          mainLog.warn('Got error from lnurl channel request: %o', data)
          throw new Error(data.reason)
        }

        mainLog.info('Completed channel request: %o', data)
        this.sendMessage('lnurlChannelSuccess', { service })
      }
    } catch (e) {
      mainLog.warn('Unable to complete lnurl channel request: %s', e.message)
      this.sendMessage('lnurlChannelError', { service, reason: e.message })
    } finally {
      this.resetChannel()
    }
  }

  /** AUTH ------------------------------------------------------------------ */

  /**
   * startAuth - Initiates lnurl auth process by sending query to renderer
   * process to initiate auth connect.
   */
  async startAuth() {
    const { lnurl, secret } = this.authParams
    const service = getServiceName(lnurl)

    if (this.isAuthProcessing) {
      mainLog.warn('Error processing lnurl auth request: busy')
      this.sendMessage('lnurlAuthError', { service, reason: 'service busy' })
      return
    }
    this.isAuthProcessing = true

    const authParams = { service, secret }
    mainLog.info('Processing lnurl auth request: %o', authParams)
    this.sendMessage('lnurlAuthRequest', authParams)
  }

  /**
   * resetAuth - Resets lnurl-auth state.
   */
  resetAuth = () => {
    this.isAuthProcessing = false
    this.authParams = {}
  }

  /**
   * onCancelAuth - Cancels an lnurl-auth request.
   */
  onCancelAuth = () => {
    mainLog.info('Cancelling lnurl auth request: %o', this.authParams)
    this.resetAuth()
  }

  /**
   * onFinishAuth - Finalizes an lnurl-auth request.
   *
   * @param {object} event Event
   * @param {object} data Data
   */
  onFinishAuth = async (event, { sig, key }) => {
    mainLog.info('Finishing lnurl auth request: %o', this.authParams)
    const { lnurl } = this.authParams
    const service = getServiceName(lnurl)

    try {
      if (sig && key) {
        const callback = `${lnurl}&sig=${sig}&key=${key}`
        const { data } = await makeAuthRequest({ lnurl, callback })

        if (data.status === LNURL_STATUS_ERROR) {
          mainLog.warn('Got error from lnurl auth request: %o', data)
          throw new Error(data.reason)
        }

        mainLog.info('Completed auth request: %o', data)
        this.sendMessage('lnurlAuthSuccess', { service })
      }
    } catch (e) {
      mainLog.warn('Unable to complete lnurl auth request: %s', e.message)
      this.sendMessage('lnurlAuthError', { service, reason: e.message })
    } finally {
      this.resetAuth()
    }
  }
}
