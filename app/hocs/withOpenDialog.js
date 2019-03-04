/**
 * Invokes electron open dialog
 */

/**
 *
 * @param {string} mode electron dialog.showOpenDialog compatible mode
 */
function openDialog(mode = 'openFile') {
  const result = window.showOpenDialog({
    properties: [mode]
  })

  if (result && result.length) {
    return result[0]
  }

  return ''
}

/**
 * Render prop that allows children to call native select directory dialog
 * @param {*} param0
 */
const WithOpenDialog = ({ render }) => render({ openDialog })

export default WithOpenDialog
