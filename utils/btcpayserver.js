import get from 'lodash.get'

const parseConnectionString = (value, network = 'BTC') => {
  let config = {}
  try {
    config = JSON.parse(value)
  } catch (e) {
    throw new Error('Invalid connection string')
  }
  const allConfigs = get(config, 'configurations', [])
  const params = allConfigs.find(c => c.type === 'grpc' && c.cryptoCode === network) || {}
  const { host, port, macaroon } = params
  if (!host || !port || !macaroon) {
    throw new Error('Invalid connection string')
  }
  return { host, port, macaroon }
}

export default parseConnectionString
