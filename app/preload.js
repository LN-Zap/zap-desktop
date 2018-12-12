const { shell } = require('electron')

init()

function init() {
  // Expose a bridging API to by setting an global on `window`.
  //
  // !CAREFUL! do not expose any functionality or APIs that could compromise the
  // user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
  window.Zap = {
    openHelpPage
  }
}

// Open the help page in a new browser window,.
function openHelpPage() {
  shell.openExternal('https://ln-zap.github.io/zap-tutorials/zap-desktop-getting-started')
}
