// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db
/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

const electron_notarize = require('electron-notarize')

module.exports = async function afterSignHook(params) {
  // Only notarize the app on Mac OS only.
  if (process.platform !== 'darwin') {
    return
  }
  console.log('afterSign hook triggered', params)

  // Same appId in electron-builder.
  const appBundleId = 'org.develar.Zap'

  const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`)
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`)
  }

  console.log(`Notarizing ${appBundleId} found at ${appPath}`)

  try {
    await electron_notarize.notarize({
      appBundleId,
      appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      ascProvider: process.env.APPLE_ID_TEAMID,
    })
  } catch (error) {
    console.error(error)
  }

  console.log(`Done notarizing ${appBundleId}`)
}
