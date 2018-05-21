// Cert will be located depending on your machine
// Mac OS X: /Users/user/Library/Application Support/Lnd/tls.cert
// Linux: ~/.lnd/tls.cert
// Windows: TODO find out where cert is located for windows machine
import { userInfo, platform } from 'os'
import { join } from 'path'
import Store from 'electron-store'

const store = new Store({ name: 'connection' })
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
  lndPath = join(__dirname, '..', '..', '..', 'resources', 'bin', plat, lndBin)
} else {
  lndPath = join(__dirname, '..', '..', '..', 'bin', lndBin)
}

export default {
  lnd: () => ({
    lndPath,
    lightningRpc: `${__dirname}/rpc.proto`,
    lightningHost: store.get('host') || 'localhost:10009',
    cert: store.get('cert') || join(userInfo().homedir, loc),
    macaroon: store.get('macaroon') || join(userInfo().homedir, macaroonPath)
  })
}
