/**
 * genEncryptionKey - Generate a new random encryption key.
 *
 * @returns {Uint8Array} random bytes
 */
export const genEncryptionKey = () => {
  const { randomBytes } = window.Zap
  return randomBytes(32)
}

/**
 * hashPassword - Hashes a password.
 *
 * @param {string} password Password to hash
 * @returns {string} Hashed password
 */
export const hashPassword = async password => {
  const { sha256digest } = window.Zap
  return sha256digest(password)
}
