import get from 'lodash/get'

/**
 * parseConnectionString - Parse a BTCPay Server style connection string.
 *
 * @param  {string} value Connection string
 * @param  {string} network Network code of config to extract
 * @returns {{ host, port, macaroon, cert }} Parsed connection string
 */
const parseConnectionString = (value, network = 'BTC') => {
  let config = {}
  try {
    config = JSON.parse(value)
  } catch (e) {
    throw new Error('Invalid connection string')
  }
  const allConfigs = get(config, 'configurations', [])
  const params = allConfigs.find(c => c.type === 'grpc' && c.cryptoCode === network) || {}
  const { host, port, macaroon, cert } = params
  if (!host || !port || !macaroon) {
    throw new Error('Invalid connection string')
  }
  return { host, port, macaroon, cert }
}

export default parseConnectionString
