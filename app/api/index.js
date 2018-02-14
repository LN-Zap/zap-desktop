import axios from 'axios'
import storage from 'electron-json-storage'

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

export function saveData(key, value) {
  storage.set(key, value, error => {
    if (error) { console.log('error saving data: ', error) }
  })
}

export function getData(key) {
  return new Promise((resolve, reject) => {
    storage.get(key, (error, data) => {
      if (error) { reject(error) }

      resolve(data)
    })
  })
}
