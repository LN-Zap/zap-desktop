import { ipcMain, dialog } from 'electron'

import { mainLog } from '@zap/utils/log'

import saveInvoice from './invoice'
/**
 * createService - Creates pdf generator service.
 *
 * @param {object} mainWindow Browser window
 */
export default function createService(mainWindow) {
  // helper func to send messages to the renderer process
  const send = (msg, params) => mainWindow.webContents.send(msg, params)

  ipcMain.on('saveInvoice', async (event, { defaultFilename, title, subtitle, invoiceData }) => {
    try {
      const path = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultFilename,
        filters: [
          {
            name: 'PDF file',
            extensions: ['pdf'],
          },
        ],
      })

      if (path && !path.canceled) {
        const filePath = path.filePath || path
        await saveInvoice(filePath, title, subtitle, ...invoiceData)
        send('saveInvoiceSuccess')
      }
    } catch (e) {
      mainLog.warn(e)
      send('saveInvoiceFailure')
    }
  })
}
