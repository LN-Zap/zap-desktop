import fs from 'fs'
import { promisify } from 'util'
import { basename } from 'path'
import { credentials } from '@grpc/grpc-js'
import lndconnect from 'lndconnect'

const readFile = promisify(fs.readFile)

/**
 * Validates and creates the ssl channel credentials from the specified file path
 * @param {String} certPath
 * @returns {grpc.ChanelCredentials}
 */
const createSslCreds = async certPath => {
  let lndCert
  if (certPath) {
    // If the cert has been provided in PEM format, use as is.
    if (certPath.split(/\n/)[0] === '-----BEGIN CERTIFICATE-----') {
      lndCert = new Buffer.from(certPath)
    }
    // If it's not a filepath, then assume it is a base64url encoded string.
    else if (certPath === basename(certPath)) {
      lndCert = lndconnect.decodeCert(certPath)
      lndCert = new Buffer.from(lndCert)
    }
    // Otherwise, lets treat it as a file path.
    else {
      lndCert = await readFile(certPath).catch(e => {
        const error = new Error(`SSL cert path could not be accessed: ${e.message}`)
        error.code = 'LND_GRPC_CERT_ERROR'
        throw error
      })
    }
  }
  return credentials.createSsl(lndCert)
}

export default createSslCreds
