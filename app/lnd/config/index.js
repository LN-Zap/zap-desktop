// Cert will be located depending on your machine
// Mac OS X: /Users/user/Library/Application Support/Lnd/tls.cert
// Linux: ~/.lnd/tls.cert
// Windows: TODO find out where cert is located for windows machine
import { userInfo } from 'os'

export default {
  lightningRpc: `${__dirname}/rpc.proto`,
  lightningHost: 'localhost:10009',
  cert: `/Users/${userInfo().username}/Library/Application Support/Lnd/tls.cert`
}
