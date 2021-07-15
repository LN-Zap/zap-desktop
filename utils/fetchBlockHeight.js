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
          baseUrl: `https://api.smartbit.com.au/v1/blockchain/blocks?limit=1`,
          path: 'blocks[0].height',
        },
        {
          baseUrl: `https://api.blockcypher.com/v1/btc/main`,
          path: 'height',
        },
      ],
      testnet: [
        {
          baseUrl: `https://testnet-api.smartbit.com.au/v1/blockchain/blocks?limit=1`,
          path: 'blocks[0].height',
        },
        {
          baseUrl: `https://api.blockcypher.com/v1/btc/test3`,
          path: 'height',
        },
      ],
    },
  }
  const fetchData = (baseUrl, path) => {
    mainLog.info(`Fetching current block height from ${baseUrl}`)
    return axios({
      method: 'get',
      timeout: 5000,
      url: baseUrl,
    })
      .then(response => {
        const height = Number(get(response.data, path))
        mainLog.info(`Fetched block height as ${height} from: ${baseUrl}`)
        return height
      })
      .catch(err => {
        mainLog.warn(`Unable to fetch block height from ${baseUrl}: ${err.message}`)
      })
  }

  const sources = get(allSources, `${chain}.${network}`, [])
  return Promise.race(sources.map(source => fetchData(source.baseUrl, source.path)))
}

export default fetchBlockHeight
