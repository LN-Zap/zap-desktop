import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  hostname_title: 'Host',
  hostname_description: 'Hostname and port of the Lnd gRPC interface. Example: localhost:10009',
  cert_title: 'TLS Certificate',
  cert_description: 'Path to the lnd tls cert. Example: /path/to/tls.cert',
  macaroon_description: 'Path to the lnd macaroon file. Example: /path/to/admin.macaroon'
})
