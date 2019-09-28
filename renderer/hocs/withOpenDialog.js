import { mainLog } from '@zap/utils/log'
/**
 * Invokes electron open dialog
 */

/**
 * openDialog - Open electron dialog.
 *
 * @param {string} mode electron dialog.showOpenDialog compatible mode
 * @returns {string|null} File path chosen by the user or `null` if dialog was cancelled/error has occurred
 */
async function openDialog(mode = 'openFile') {
  try {
    const { canceled, filePaths } = await window.showOpenDialog({
      properties: [mode],
    })

    if (!canceled && filePaths.length) {
      return filePaths[0]
    }

    return null
  } catch (e) {
    mainLog.warn('openDialog error: %o', e)
    return null
  }
}

/**
 * WithOpenDialog - Render prop that allows children to call native select directory dialog
 *
 * @param {Function} render Render method
 */

const WithOpenDialog = ({ render }) => render({ openDialog })

export default WithOpenDialog
