import axios from 'axios'

export function requestTicker(id) {
  const BASE_URL = `https://api.coinmarketcap.com/v1/ticker/${id}/`
  return axios({
    method: 'get',
    url: BASE_URL
  })
    .then(response => response.data)
    .catch(error => error)
}

export function requestTickers(ids) {
  return axios.all(ids.map(id => requestTicker(id)))
    .then(axios.spread((btcTicker, ltcTicker) => ({ btcTicker: btcTicker[0], ltcTicker: ltcTicker[0] })))
}

export function requestBlockHeight() {
  const BASE_URL = 'https://testnet-api.smartbit.com.au/v1/blockchain/blocks?limit=1'
  return axios({
    method: 'get',
    url: BASE_URL
  })
    .then(response => response.data)
    .catch(error => error)
}

export function requestSuggestedNodes() {
  const BASE_URL = 'https://zap.jackmallers.com/suggested-peers'
  return axios({
    method: 'get',
    url: BASE_URL
  })
    .then(response => response.data)
    .catch(error => error)
}
