import ipaddr from 'ipaddr.js'

/**
 * Checks if specified address is a valid ipv6 address. Supports regular and port notation
 * e.g [::1]:8080
 *
 * @export
 * @param {string} ip
 * @returns {Boolean}
 */
export function isIpV6(ip) {
  const { IPv6 } = ipaddr
  if (IPv6.isValid(ip)) {
    return true
  }
  const [host] = splitIpV6(ip)
  return IPv6.isValid(host)
}

/**
 * Splits valid ipv6 address into host + port
 *
 * @export
 * @param {string} ip valid ipv6 address
 * @returns {Array|null} [host, port] or just [host] or null if `ip` is not set
 */
export function splitIpV6(ip) {
  if (!ip) {
    return null
  }
  return ip.charAt(0) === '[' ? ip.substr(1).split(']:') : [ip]
}

/**
 * Removes port part from the ipv6 address. Checks for `ip` to be valid ipv6 address
 *
 * @export
 * @param {string} ip
 * @returns {string} ipv6 host
 */
export function stripIpV6Port(ip) {
  if (isIpV6(ip)) {
    return splitIpV6(ip)[0]
  }
  return ip
}
