import axios from 'axios'
import get from 'lodash/get'
import { mainLog } from '@zap/utils/log'

/**
 * fetchBlockHeight - Fetch the current block height.
 *
 * @param {string} chain Chain name
 * @param {string} network Network name
 * @returns {number} The current block height.
 */
const fetchBlockHeight = (chain, network) => {
  const allSources = {
    bitcoin: {
      mainnet: [
        {
          baseUrl: 'https://chain.api.btc.com/v3/block/latest',
          path: 'data.height',
        },
        {
          baseUrl: 'https://api.blockcypher.com/v1/btc/main',
          path: 'height',
        },
      ],
      testnet: [
        {
          baseUrl: 'https://testnet-api.smartbit.com.au/v1/blockchain/blocks?limit=1',
          path: 'blocks[0].height',
        },
        {
          baseUrl: 'https://api.blockcypher.com/v1/btc/test3',
          path: 'height',
        },
      ],
    },
  }

  const sources = get(allSources, `${chain}.${network}`, [])
  const promises = sources.map(source =>
    axios({ method: 'get', timeout: 5000, url: source.baseUrl })
      .then(response => {
        const height = Number(get(response.data, source.path))
        mainLog.info(`Fetched block height as ${height} from: ${source.baseUrl}`)
        return height
      })
      .catch(err => {
        mainLog.warn(`Unable to fetch block height from ${source.baseUrl}: ${err.message}`)
        throw err
      })
  )

  return new Promise((resolve, reject) => {
    const errors = []
    promises.forEach((promise, index) => {
      promise
        .then(result => {
          return resolve(result)
        })
        .catch(error => {
          errors.push(error)
          if (errors.length === promises.length) {
            const errorMessages = errors
              .map(e => `${sources[index].baseUrl}: ${e.message}`)
              .join(', ')
            const finalError = new Error(
              `Unable to fetch block height from all sources: ${errorMessages}`
            )
            reject(finalError)
          }
        })
    })
  })
}

export default fetchBlockHeight
