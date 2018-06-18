// Cert will be located depending on your machine
// Mac OS X: /Users/user/Library/Application Support/Lnd/tls.cert
// Linux: ~/.lnd/tls.cert
// Windows: TODO find out where cert is located for windows machine
import { userInfo, platform } from 'os'
import { join, normalize } from 'path'
import Store from 'electron-store'
import { app } from 'electron'

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

// Get an electromn store named 'connection' in which the saved connection detailes are stored.
const store = new Store({ name: 'connection' })

// Get the name of the current platform which we can use to determine the location of various lnd resources.
const plat = platform()

let loc
let macaroonPath
let lndBin
let lndPath

switch (plat) {
  case 'darwin':
    loc = 'Library/Application Support/Lnd/tls.cert'
    macaroonPath = 'Library/Application Support/Lnd/admin.macaroon'
    lndBin = 'lnd'
    break
  case 'linux':
    loc = '.lnd/tls.cert'
    macaroonPath = '.lnd/admin.macaroon'
    lndBin = 'lnd'
    break
  case 'win32':
    loc = join('Appdata', 'Local', 'Lnd', 'tls.cert')
    macaroonPath = join('Appdata', 'Local', 'Lnd', 'admin.macaroon')
    lndBin = 'lnd.exe'
    break
  default:
    break
}

if (process.env.NODE_ENV === 'development') {
  lndPath = join(appRootPath, 'resources', 'bin', plat, lndBin)
} else {
  lndPath = join(appRootPath, 'bin', lndBin)
}

export default {
  lnd: () => ({
    lndPath,
    lightningRpc: join(appRootPath, 'resources', 'rpc.proto'),
    lightningHost: store.get('host') || 'localhost:10009',
    cert: store.get('cert') || join(userInfo().homedir, loc),
    macaroon: store.get('macaroon') || join(userInfo().homedir, macaroonPath),
  }),
}
