import axios from 'axios'

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
const scheme = process.env.HOT ? '/proxy/' : 'https://'

export function requestTicker(id) {
  const BASE_URL = `${scheme}api.coinmarketcap.com/v1/ticker/${id}`
  return axios({
    method: 'get',
    url: BASE_URL
  }).then(response => response.data)
}

export function requestTickers(ids) {
  return axios
    .all(ids.map(id => requestTicker(id)))
    .then(
      axios.spread((btcTicker, ltcTicker) => ({ btcTicker: btcTicker[0], ltcTicker: ltcTicker[0] }))
    )
}

export function requestBlockHeight() {
  const BASE_URL = `${scheme}testnet-api.smartbit.com.au/v1/blockchain/blocks?limit=1`
  return axios({
    method: 'get',
    url: BASE_URL
  }).then(response => response.data)
}

export function requestSuggestedNodes() {
  const BASE_URL = `${scheme}zap.jackmallers.com/suggested-peers`
  return axios({
    method: 'get',
    url: BASE_URL
  }).then(response => response.data)
}
