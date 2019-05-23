/**
 * Parses url fragments string as returned by url.parse format e.g #param1=value&param2=value
 *
 * @export
 * @param {string} hash
 * @returns {Object} <key, value> param map
 */
export default function parseUrlFragments(hash) {
  return hash
    ? hash
        .substring(1)
        .split('&')
        .map(p => p.split('='))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    : {}
}
