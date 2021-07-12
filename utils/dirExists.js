import { existsSync } from 'fs'

import untildify from 'untildify'

/**
 * dirExists - Check a directory exists.
 *
 * @param {string} path Path of directory to check for existence
 * @returns {Promise<boolean>} Boolean indicating whether directory exists
 */
const dirExists = path => existsSync(untildify(path))

export default dirExists
