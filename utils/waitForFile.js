import fs from 'fs'
import { promisify } from 'util'
import { mainLog } from '@zap/utils/log'

const stat = promisify(fs.stat)

/**
 * Wait for a file to exist.
 * @param {String} filepath
 */
const waitForFile = (filepath, timeout = 1000) => {
  let timeoutId
  let intervalId

  // This promise rejects after the timeout has passed.
  let timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      mainLog.debug('deadline (%sms) exceeded before file (%s) was found', timeout, filepath)
      // Timout was reached, so clear all remaining timers.
      clearInterval(intervalId)
      clearTimeout(timeoutId)
      reject(new Error(`Unable to find file: ${filepath}`))
    }, timeout)
  })

  // This promise checks the filsystem every 200ms looking for the file, and resolves when the file has been found.
  let checkFileExists = new Promise(resolve => {
    let intervalId = setInterval(async () => {
      mainLog.debug('waiting for file: %s', filepath)
      try {
        await stat(filepath)
        mainLog.debug('found file: %s', filepath)
        // The file was found, so clear all remaining timers.
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        resolve()
      } catch (e) {
        // If the file wasn't found with stat, do nothing, we will check again in 200ms.
        return
      }
    }, 200)
  })

  // Let's race our promises.
  return Promise.race([timeoutPromise, checkFileExists])
}

export default waitForFile
