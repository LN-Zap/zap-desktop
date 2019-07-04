/**
 * Invokes electron open dialog
 */

/**
 * openDialog - Open electron dialog.
 *
 * @param {string} mode electron dialog.showOpenDialog compatible mode
 * @returns {string[]} An array of file paths chosen by the user
 */
function openDialog(mode = 'openFile') {
  const result = window.showOpenDialog({
    properties: [mode],
  })

  if (result && result.length) {
    return result[0]
  }

  return ''
}

/**
 * WithOpenDialog - Render prop that allows children to call native select directory dialog
 *
 * @param {Function} render Render method
 */

const WithOpenDialog = ({ render }) => render({ openDialog })

export default WithOpenDialog
