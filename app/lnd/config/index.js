// Cert will be located depending on your machine
// Mac OS X: /Users/user/Library/Application Support/Lnd/tls.cert
// Linux: ~/.lnd/tls.cert
// Windows: TODO find out where cert is located for windows machine
import { userInfo, platform } from 'os'
import { join } from 'path'

let loc
switch (platform()) {
  case 'darwin':
    loc = 'Library/Application Support/Lnd/tls.cert'
    break
  case 'linux':
    loc = '.lnd/tls.cert'
    break
  case 'win32':
    loc = join('Appdata', 'Local', 'Lnd', 'tls.cert')
    break
  default:
    break
}

export default {
  lightningRpc: `${__dirname}/rpc.proto`,
  lightningHost: 'localhost:10009',
  cert: join(userInfo().homedir, loc)
}
