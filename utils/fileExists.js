import fs from 'fs'
import { promisify } from 'util'

import untildify from 'untildify'

const fsReadFile = promisify(fs.readFile)

/**
 * fileExists - Check a file exists.
 *
 * @param {string} path Path of file to check for existence
 * @returns {Promise<boolean>} Boolean indicating whether file exists
 */
const fileExists = async path => fsReadFile(untildify(path))

export default fileExists
