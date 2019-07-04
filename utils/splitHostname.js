import { parse } from 'url'

/**
 * splitHostname - Splits hostname into a host+port.
 *
 * @param {string} host Host
 * @returns {{host,port}} Object containing `host` and `port` keys
 */
const splitHostname = host => {
  const { hostname = host, port } = parse(`http://${host}`)
  // if hostname is not set it means `parse` was unable to parse
  // in this case just return whatever came in as a host
  return { host: hostname, port }
}

export default splitHostname
