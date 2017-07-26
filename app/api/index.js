import axios from 'axios'

export function callApi(endpoint, method = 'get', data = null) {
  const BASE_URL = 'http://localhost:3000/api/'
  let payload

  if (data) {
    payload = {
      headers: {
        'Content-Type': 'application/json'
      },
      method,
      data,
      url: `${BASE_URL}${endpoint}`
    }
  } else {
    payload = {
      headers: {
        'Content-Type': 'application/json'
      },
      method,
      url: `${BASE_URL}${endpoint}`
    }
  }

  return axios(payload)
  .then(response => response.data)
  .catch(error => error)
}

export function callApis(endpoints) {
  const BASE_URL = 'http://localhost:3000/api/'
  return axios.all(endpoints.map(endpoint => callApi(endpoint)))
}

export function requestTicker() {
  const BASE_URL = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/'
  return axios({
    method: 'get',
    url: BASE_URL
  })
  .then(response => response.data)
  .catch(error => error)
}