import axios from 'axios'

export default function requestTicker() {
  const BASE_URL = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/'
  return axios({
    method: 'get',
    url: BASE_URL
  })
    .then(response => response.data)
    .catch(error => error)
}
