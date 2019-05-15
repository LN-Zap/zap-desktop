import axios from 'axios'
import { mainLog } from '@zap/utils/log'

// When running in development/hot mode we load the renderer js code via webpack dev server, and it is from there that
// we ultimately initate requests to these remote resources. The end result is that the electron browser window makes a
// request to localhost (to webpack dev server), which in turn makes a request to the remote resource. If the remote
// resource in question has a restrictive `Access-Control-Allow-Origin` header, this may cause the electron browser
// window to not allow loading the remote content.
//
// See https://enable-cors.org/
//
// In order to mitigate the CORS issue, we instead access these remote resources through a local proxy that we have
// defined on the webpack dev server.
const scheme =
  (process && process.env.HOT) || (window.env && window.env.HOT) ? '/proxy/' : 'https://'

export function requestTicker(id) {
  const BASE_URL = `${scheme}api.coinbase.com/v2/exchange-rates?currency=${id}`
  return axios({
    method: 'get',
    url: BASE_URL,
  }).then(response => response.data)
}

export function requestTickers(ids) {
  return axios.all(ids.map(id => requestTicker(id))).then(
    axios.spread((btcTicker, ltcTicker) => ({
      btcTicker: btcTicker.data.rates,
      ltcTicker: ltcTicker.data.rates,
    }))
  )
}

export function requestSuggestedNodes() {
  const BASE_URL = `${scheme}zap.jackmallers.com/api/v1/suggested-peers`
  return axios({
    method: 'get',
    url: BASE_URL,
  }).then(response => response.data)
}

export function requestNodeScores(chain, network) {
  const chainMap = {
    bitcoin: 'btc',
    litecoin: 'ltc',
  }
  const networkMap = {
    mainnet: '',
    testnet: 'testnet',
  }
  const code = chainMap[chain]
  const suffix = networkMap[network]
  const chainCode = `${code}${suffix}`
  const BASE_URL = `https://nodes.lightning.computer/availability/v1/${chainCode}.json`
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

export function requestFees(options) {
  const BASE_URL = 'https://bitcoinfees.earn.com/api/v1/fees/list'
  return axios({
    method: 'get',
    url: BASE_URL,
  }).then(response => {
    /**
     * Get the lowest fee to get in within a given number of target confs
     * @param  {number} targetConfs The target number of blocks
     * @return {number|null} The fee rate in satoshi/byte
     */
    const getFee = targetConfs => {
      const targetDelay = targetConfs - 1
      let feeRange = response.data.fees
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
      return feeRange.length ? feeRange[0].maxFee : null
    }

    const { fast, medium, slow } = options
    return {
      fast: getFee(fast),
      medium: getFee(medium),
      slow: getFee(slow),
    }
  })
}
