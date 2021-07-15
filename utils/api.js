import axios from 'axios'
import config from 'config'

import { mainLog } from '@zap/utils/log'

/**
 * requestSuggestedNodes - Fetch suggested nodes list.
 *
 * @returns {*} Suggested node list
 */
export function requestSuggestedNodes() {
  const BASE_URL = config.channels.suggestedNodes
  mainLog.info('Fetching suggested nodes from: %s', BASE_URL)
  return axios({
    method: 'get',
    url: BASE_URL,
  }).then(response => response.data)
}

/**
 * requestNodeScores - Fetch BOS node scores.
 *
 * @param {string} chain Chain name
 * @param {string} network Network name
 * @returns {*} BOS node scores processed into a format that lnd heuristics expects
 */
export function requestNodeScores(chain, network) {
  const chainMap = {
    bitcoin: 'btc',
  }
  const networkMap = {
    mainnet: '',
    testnet: 'testnet',
  }
  const code = chainMap[chain]
  const suffix = networkMap[network]
  const chainCode = `${code}${suffix}`
  const BASE_URL = `https://nodes.lightning.computer/availability/v1/${chainCode}.json`
  mainLog.info('Fetching node scores from: %s', BASE_URL)
  return axios({
    method: 'get',
    url: BASE_URL,
  }).then(response =>
    response.data.scores.reduce((map, { public_key, score }) => {
      if (typeof public_key !== 'string' || !Number.isInteger(score)) {
        mainLog.warn('Invalid node score format!')
        return map
      }
      map[public_key] = score / 100000000.0
      return map
    }, {})
  )
}

/**
 * requestFees - Fetch recommended fees from earn.com.
 *
 * @param {{fast, medium, slow}} options Options
 *
 * @returns {{fastestFee:number, halfHourFee:number, hourFee:number}} Recommended fees
 */
export function requestFees(options) {
  const BASE_URL = 'https://bitcoinfees.earn.com/api/v1/fees/list'
  mainLog.info('Fetching fees from: %s', BASE_URL)
  return axios({
    method: 'get',
    url: BASE_URL,
  }).then(response => {
    /**
     * getFee - Get the lowest fee to get in within a given number of target confs.
     *
     * @param {number} targetConfs The target number of blocks
     * @returns {number|null} The fee rate in satoshi/byte
     */
    const getFee = targetConfs => {
      const targetDelay = targetConfs - 1
      const feeRange = response.data.fees
        // Filter out everything where the max delay is less than our target delay.
        .filter(f => f.maxDelay >= targetDelay)
        // Only include items with the lowest fee that is closest to our target delay.
        .reduce((acc, cur, idx, src) => {
          const lowestDelay = src[src.length - 1].maxDelay
          if (cur.maxDelay === lowestDelay) {
            acc.push(cur)
          }
          return acc
        }, [])
      return feeRange.length ? feeRange[0].maxFee : 0
    }

    const { fast, medium, slow } = options
    return {
      fast: getFee(fast),
      medium: getFee(medium),
      slow: getFee(slow),
    }
  })
}
