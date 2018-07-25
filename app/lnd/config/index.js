// Cert will be tlsCertPathated depending on your machine:
//
// Mac OS X: /Users/.../Library/Application Support/Lnd/tls.cert
// Linux: ~/.lnd/tls.cert
// Windows: C:\Users\...\AppData\Local\Lnd
import { homedir, platform } from 'os'
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

// Get the name of the current platform which we can use to determine the tlsCertPathation of various lnd resources.
const plat = platform()

// Get the OS specific default lnd data dir and binary name.
let lndDataDir
let lndBin
switch (plat) {
  case 'darwin':
    lndDataDir = join(homedir(), 'Library', 'Application Support', 'Lnd')
    lndBin = 'lnd'
    break
  case 'linux':
    lndDataDir = join(homedir(), '.lnd')
    lndBin = 'lnd'
    break
  case 'win32':
    lndDataDir = join(process.env.APPDATA, 'Local', 'Lnd')
    lndBin = 'lnd.exe'
    break
  default:
    break
}

// Get the path to the lnd binary.
let lndPath
if (isDev) {
  lndPath = join(dirname(require.resolve('lnd-binary/package.json')), 'vendor', lndBin)
} else {
  lndPath = join(appRootPath, 'bin', lndBin)
}

export default {
  lnd: () => {
    // Get an electromn store named 'connection' in which the saved connection detailes are stored.
    const store = new Store({ name: 'connection' })

    // Determine what hostname to use.
    let host = store.get('host')
    if (typeof host === 'undefined') {
      host = 'localhost:10009'
    }

    // Determine what cert to use.
    let cert = store.get('cert')
    if (typeof cert === 'undefined') {
      cert = join(lndDataDir, 'tls.cert')
    }

    // Determine what macaroon to use.
    let macaroon = store.get('macaroon')
    if (typeof macaroon === 'undefined') {
      macaroon = join(lndDataDir, 'admin.macaroon')
    }

    return {
      lndPath,
      configPath: join(appRootPath, 'resources', 'lnd.conf'),
      rpcProtoPath: join(appRootPath, 'resources', 'rpc.proto'),
      host,
      cert: untildify(cert),
      macaroon: untildify(macaroon)
    }
  }
}
