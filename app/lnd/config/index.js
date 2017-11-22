// Cert will be located depending on your machine
// Mac OS X: /Users/user/Library/Application Support/Lnd/tls.cert
// Linux: ~/.lnd/tls.cert
// Windows: TODO find out where cert is located for windows machine
import { userInfo, platform } from 'os'

var loc;
if (platform() == 'linux') {
  loc = `/home/${userInfo().username}/.lnd/tls.cert`
} else if (platform() == 'darwin') {
  loc = `/Users/${userInfo().username}/Library/Application Support/lnd/tls.cert`
}

export default {
  lightningRpc: `${__dirname}/rpc.proto`,
  lightningHost: 'localhost:10009',
  cert: loc
}
