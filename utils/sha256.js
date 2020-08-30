import { createHash } from 'crypto'

/**
 * sha256digest - Generates a digest of the `message`(hex)
 *
 * @param {string} message message to hash
 * @param {string} [encoding] Endoding to output
 * @returns {Buffer|string} sha256 hash of a message`. If encoding is provided a string will be returned;
 *  otherwise a Buffer is returned.
 */
export const sha256digest = (message, encoding) =>
  createHash('sha256')
    .update(message)
    .digest(encoding)
