import { lookup } from 'ps-node'
import { mainLog } from '../../utils/log'

/**
 * Check to see if an LND process is running.
 * @return {Promise} Boolean indicating wether an existing lnd process was found on the host machine.
 */
const isLndRunning = () => {
  return new Promise((resolve, reject) => {
    mainLog.info('Looking for existing lnd process')
    lookup({ command: 'lnd' }, (err, results) => {
      // There was an error checking for the LND process.
      if (err) {
        return reject(err)
      }

      if (!results.length) {
        // An LND process was found, no need to start our own.
        mainLog.info('Existing lnd process not found')
        return resolve(false)
      }
      mainLog.info('Found existing lnd process')
      return resolve(true)
    })
  })
}

export default isLndRunning
