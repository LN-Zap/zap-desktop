import crypto from 'crypto'

/**
 * sha256digest - Generates a digest of the `message`
 *
 * @param {string} message message to hash
 * @returns {string} sha256 hex hash of a `message`
 */
export default function sha256digest(message) {
  return crypto
    .createHash('sha256')
    .update(message)
    .digest('hex')
}
