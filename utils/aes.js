import crypto from 'crypto'

const algorithm = 'aes-256-ctr'

/**
 * @param buffer
 * @param password
 */
export function encrypt(buffer, password) {
  const cipher = crypto.createCipher(algorithm, password)
  const crypted = Buffer.concat([cipher.update(buffer), cipher.final()])
  return crypted
}

/**
 * @param buffer
 * @param password
 */
export function decrypt(buffer, password) {
  const decipher = crypto.createDecipher(algorithm, password)
  const dec = Buffer.concat([decipher.update(buffer), decipher.final()])
  return dec
}
