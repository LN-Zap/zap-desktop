import { platform } from 'os'
import { dirname, join, normalize } from 'path'
import Store from 'electron-store'
import { app } from 'electron'
import isDev from 'electron-is-dev'
import untildify from 'untildify'

// Get a path to prepend to any nodejs calls that are getting at files in the package,
// so that it works both from source and in an asar-packaged mac app.
// See https://github.com/electron-userland/electron-builder/issues/751
//
// windows from source: "C:\myapp\node_modules\electron\dist\resources\default_app.asar"
// mac from source: "/Users/me/dev/myapp/node_modules/electron/dist/Electron.app/Contents/Resources/default_app.asar"
// mac from a package: <somewhere>"/my.app/Contents/Resources/app.asar"
//
// If we are run from outside of a packaged app, our working directory is the right place to be.
// And no, we can't just set our working directory to somewhere inside the asar. The OS can't handle that.
const appPath = app.getAppPath()
const appRootPath = appPath.indexOf('default_app.asar') < 0 ? normalize(`${appPath}/..`) : ''

// Get the OS specific path to the lnd binary.
const lndBin = platform() === 'win32' ? 'lnd.exe' : 'lnd'
let lndPath
if (isDev) {
  lndPath = join(dirname(require.resolve('lnd-binary/package.json')), 'vendor', lndBin)
} else {
  lndPath = join(appRootPath, 'bin', lndBin)
}

/**
 * Get current lnd configuration.
 *
 * Cert and Macaroon will be at one of the following destinations depending on your machine:
 * Mac OS X: ~/Library/Application Support/Lnd/tls.cert
 * Linux: ~/.lnd/tls.cert
 * Windows: C:\Users\...\AppData\Local\Lnd
 *
 * @return {object} current lnd configuration options.
 */
const lnd = () => {
  // Get an electron store named 'connection' in which the saved connection detailes are stored.
  const store = new Store({ name: 'connection' })

  /**
   * Fetch a config option from the connection store.
   * if undefined fallback to a path relative to the lnd data dir.
   *
   * @param {string} name name of property to fetch from the store.
   * @param {string} path path relative to the lnd data dir.
   * @return {string} config param or filepath relative to the lnd data dir.
   */
  const getFromStoreOrDataDir = (name, file) => {
    let path = store.get(name)
    if (typeof path === 'undefined') {
      path = join(app.getPath('userData'), file)
    }
    return untildify(path)
  }

  return {
    lndPath,
    configPath: join(appRootPath, 'resources', 'lnd.conf'),
    rpcProtoPath: join(appRootPath, 'resources', 'rpc.proto'),
    host: store.get('host', 'localhost:10009'),
    cert: getFromStoreOrDataDir('cert', 'tls.cert'),
    macaroon: getFromStoreOrDataDir('macaroon', 'admin.macaroon')
  }
}

export default { lnd }
