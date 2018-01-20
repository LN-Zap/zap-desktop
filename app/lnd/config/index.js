// Cert will be located depending on your machine
// Mac OS X: /Users/user/Library/Application Support/Lnd/tls.cert
// Linux: ~/.lnd/tls.cert
// Windows: TODO find out where cert is located for windows machine
import { userInfo, platform } from 'os'
import { join } from 'path'

let loc
let macaroonPath
switch (platform()) {
  case 'darwin':
    loc = 'Library/Application Support/Lnd/tls.cert'
    macaroonPath = 'Library/Application Support/Lnd/admin.macaroon'
    break
  case 'linux':
    loc = '.lnd/tls.cert'
    macaroonPath = '.lnd/admin.macaroon'
    break
  case 'win32':
    loc = join('Appdata', 'Local', 'Lnd', 'tls.cert')
    macaroonPath = join('Appdata', 'Local', 'Lnd', 'admin.macaroon')
    break
  default:
    break
}

export default {
  lightningHost: 'localhost:10009',
  cert: join(userInfo().homedir, loc),
  macaroon: join(userInfo().homedir, macaroonPath)
}
