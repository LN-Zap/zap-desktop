import { ipcMain } from 'electron'
import { parse } from 'url'
import {
  fetchLnurlParams,
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
    this.isWithdrawalProcessing = false

    this.channelParams = {}
    this.isChannelProcessing = false

    ipcMain.on('lnurlFinalizeWithdraw', this.onFinishWithdrawal)
    ipcMain.on('lnurlFinalizeChannel', this.onFinishChannel)
  }

  /**
   * terminate - De-initializer routine. Must be called when particular
   * `LnurlService` instance is of no use anymore.
   */
  terminate() {
    ipcMain.off('lnurlFinalizeWithdraw', this.onFinishWithdrawal)
    ipcMain.off('lnurlFinalizeChannel', this.onFinishChannel)
  }

  /**
   * send - Send a message to the renderer.
   *
   * @param {string} msg Message
   * @param {object} data Data
   */
  send(msg, data) {
    this.mainWindow.webContents.send(msg, data)
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
          await this.startWithdrawal(lnurl)
          break

        case 'channelRequest':
          this.channelParams = res
          await this.startChannel()
          break

        default:
          throw new Error('Unable to process lnurl')
      }
    } catch (error) {
      this.send('lnurlError', { message: error.message })
      throw error
    }
  }

  /**
   * startWithdrawal - Initiates lnurl withdrawal process by sending query to
   * renderer process to generate LN invoice.
   *
   * @param {string} lnurl decoded lnurl
   */
  async startWithdrawal(lnurl) {
    if (this.isWithdrawalProcessing) {
      mainLog.warn('Error processing lnurl withdraw request: busy')
      this.send('lnurlWithdrawalBusy')
      return
    }
    this.isWithdrawalProcessing = true

    const { status, reason, maxWithdrawable, defaultDescription } = this.withdrawParams
    const service = getServiceName(lnurl)

    if (status === LNURL_STATUS_ERROR) {
      const withdrawParams = { status, reason, service }
      this.isWithdrawalProcessing = false
      mainLog.error('Unable to process lnurl withdraw request: %o', withdrawParams)
      this.send('lnurlWithdrawError', withdrawParams)
      return
    }

    const withdrawParams = { amount: maxWithdrawable, memo: defaultDescription, service }
    mainLog.info('Processing lnurl withdraw request: %o', withdrawParams)
    this.send('lnurlWithdrawRequest', withdrawParams)
  }

  /**
   * onFinishChannel - Finalizes an lnurl-withdraw request.
   *
   * @param {object} event Event
   * @param {object} data Data
   */
  onFinishWithdrawal = async (event, { paymentRequest }) => {
    try {
      const { callback, secret } = this.withdrawParams
      if (callback && secret && paymentRequest) {
        const { data } = await makeWithdrawRequest({ callback, secret, invoice: paymentRequest })

        if (data.status === LNURL_STATUS_ERROR) {
          mainLog.warn('Unable to complete lnurl withdraw request: %o', data)
          this.send('lnurlWithdrawError', data)
          return
        }

        mainLog.info('Completed withdraw request: %o', data)
      }
    } catch (e) {
      mainLog.warn('Unable to complete lnurl withdrawal request: %s', e)
    } finally {
      this.isWithdrawalProcessing = false
      this.withdrawParams = {}
    }
  }

  /**
   * startChannel - Initiates lnurl channel process by sending query to renderer
   * process to initiate channel connect.
   */
  async startChannel() {
    if (this.isChannelProcessing) {
      mainLog.warn('Error processing lnurl channel request: busy')
      this.send('lnurlChannelBusy')
      return
    }
    this.isChannelProcessing = true

    const { status, uri } = this.channelParams

    if (status === LNURL_STATUS_ERROR) {
      const channelParams = { status, uri }
      this.isChannelProcessing = false
      mainLog.error('Unable to process lnurl channel request: %o', channelParams)
      this.send('lnurlChannelError', channelParams)
      return
    }

    const channelParams = { uri }
    mainLog.info('Processing lnurl channel request: %o', channelParams)
    this.send('lnurlChannelRequest', channelParams)
  }

  /**
   * onFinishChannel - Finalizes an lnurl-channel request.
   *
   * @param {object} event Event
   * @param {object} data Data
   */
  onFinishChannel = async (event, { pubkey }) => {
    try {
      const { callback, secret, uri } = this.channelParams
      if (callback && secret && pubkey) {
        const { data } = await makeChannelRequest({ callback, secret, pubkey, isPrivate: true })

        if (data.status === LNURL_STATUS_ERROR) {
          mainLog.warn('Unable to complete lnurl channel request: %o', data)
          this.send('lnurlChannelError', { ...data, uri })
          return
        }

        mainLog.info('Completed channel request: %o', data)
      }
    } catch (e) {
      mainLog.warn('Unable to complete lnurl channel request: %s', e)
    } finally {
      this.isChannelProcessing = false
      this.channelParams = {}
    }
  }
}
