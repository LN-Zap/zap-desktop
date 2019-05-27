import { parse } from 'url'

/**
 * Splits hostname into a host+port
 * @param {string} host
 * @returns {Object} {host,port}
 */
export default function splitHostname(host) {
  const { hostname = host, port } = parse(`http://${host}`)
  // if hostname is not set it means `parse` was unable to parse
  // in this case just return whatever came in as a host
  return { host: hostname, port }
}
