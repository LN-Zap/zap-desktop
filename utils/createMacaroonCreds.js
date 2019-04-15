import fs from 'fs'
import { promisify } from 'util'
import { credentials, Metadata } from '@grpc/grpc-js'

const readFile = promisify(fs.readFile)

/**
 * Validates and creates the macaroon authorization credentials from the specified file path
 * @param {String} macaroonPath
 * @returns {grpc.CallCredentials}
 */
const createMacaroonCreds = async macaroonPath => {
  const metadata = new Metadata()

  if (macaroonPath) {
    // If the macaroon is already in hex format, add as is.
    const isHex = /^[0-9a-fA-F]+$/.test(macaroonPath)
    if (isHex) {
      metadata.add('macaroon', macaroonPath)
    }
    // Otherwise, treat it as a file path - load the file and convert to hex.
    else {
      const macaroon = await readFile(macaroonPath).catch(e => {
        const error = new Error(`Macaroon path could not be accessed: ${e.message}`)
        error.code = 'LND_GRPC_MACAROON_ERROR'
        throw error
      })
      metadata.add('macaroon', macaroon.toString('hex'))
    }
  }
  return credentials.createFromMetadataGenerator((params, callback) => callback(null, metadata))
}

export default createMacaroonCreds
