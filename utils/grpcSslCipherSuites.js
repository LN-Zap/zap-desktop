const grpcSslCipherSuites = [
  // Default is ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384
  // https://github.com/grpc/grpc/blob/master/doc/environment_variables.md
  //
  // Current LND cipher suites here:
  // https://github.com/lightningnetwork/lnd/blob/master/lnd.go#L80
  //
  // We order the suites by priority, based on the recommendations provided by SSL Labs here:
  // https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices#23-use-secure-cipher-suites
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-AES128-CBC-SHA256',
  'ECDHE-ECDSA-CHACHA20-POLY1305',

  // BTCPay Server serves lnd behind an nginx proxy with a trusted SSL cert from Lets Encrypt.
  // These certs use an RSA TLS cipher suite.
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-RSA-AES128-GCM-SHA256',
].join(':')

export default grpcSslCipherSuites
