import { normalize } from 'path'
import electron from 'electron'
import { app } from '@electron/remote/main'

const electronApp = electron.app || app

/**
 * appRootPath - Get a path to prepend to any nodejs calls that are getting at files in the package so that it works
 * both from source and in an asar-packaged mac app.
 * See https://github.com/electron-userland/electron-builder/issues/751
 *
 * windows from source: "C:\myapp\node_modules\electron\dist\resources\default_app.asar"
 * mac from source: "/Users/me/dev/myapp/node_modules/electron/dist/Electron.app/Contents/Resources/default_app.asar"
 * mac from a package: <appRootPathsomewhere>"/myapp/Contents/Resources/app.asar"
 *
 * If we are run from outside of a packaged app, our working directory is the right place to be.
 * And no, we can't just set our working directory to somewhere inside the asar. The OS can't handle that.
 *
 * @returns {string} Path to the lnd binary.
 */
const appRootPath = () => {
  return electronApp.getAppPath().indexOf('default_app.asar') < 0
    ? normalize(`${electronApp.getAppPath()}/..`)
    : ''
}

export default appRootPath
