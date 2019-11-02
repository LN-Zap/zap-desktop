import { ipcMain } from 'electron'
import { parse } from 'url'
import { fetchWithdrawParams, makeWithdrawRequest, LNURL_STATUS_ERROR } from '@zap/utils/lnurl'
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
    this.isWithdrawalProcessing = false
    this.withdrawParams = {}
    ipcMain.on('lnurlCreateInvoice', this.onCreateInvoice)
  }

  /**
   * terminate - De-initializer routine. Must be called when
   * particular `LnurlService` instance is of no use anymore.
   *
   * @memberof LnurlService
   */
  terminate() {
    ipcMain.off('lnurlCreateInvoice', this.onCreateInvoice)
  }

  onCreateInvoice = async (event, { paymentRequest }) => {
    try {
      const { callback, secret } = this.withdrawParams
      if (callback && secret && paymentRequest) {
        const res = await makeWithdrawRequest({ callback, secret, invoice: paymentRequest })
        mainLog.info('Completed withdraw request: %o', res.data)
      }
    } catch (e) {
      mainLog.warn('Unable to process lnurl uri: %s', e)
    } finally {
      this.isWithdrawalProcessing = false
      this.withdrawParams = {}
    }
  }

  send(msg, params) {
    this.mainWindow.webContents.send(msg, params)
  }

  /**
   * startWithdrawal - Initiates lnurl withdrawal process by fetching params and sending query to renderer
   * process to generate LN invoice.
   *
   * @param {string} lnurl decoded lnurl
   * @memberof LnurlService
   */
  async startWithdrawal(lnurl) {
    mainLog.info('Attempting to process lnurl withdraw request: %s', lnurl)

    if (this.isWithdrawalProcessing) {
      mainLog.warn('Error processing lnurl withdraw request: busy')
      this.send('lnurlWithdrawalBusy')
      return
    }

    this.withdrawParams = await fetchWithdrawParams(lnurl)
    const { status, reason, maxWithdrawable, defaultDescription } = this.withdrawParams
    const service = getServiceName(lnurl)

    if (status === LNURL_STATUS_ERROR) {
      const params = { status, reason, service }
      mainLog.error('Unable to process lnurl withdraw request: %o', params)
      this.send('lnurlError', params)
      return
    }

    const params = { amount: maxWithdrawable, memo: defaultDescription, service }
    mainLog.info('Processing lnurl withdraw request: %o', params)
    this.send('lnurlRequest', params)
  }
}
