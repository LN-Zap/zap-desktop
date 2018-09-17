const dns = jest.genMockFromModule('dns')

function lookup(hostname, options, callback = jest.fn()) {
  let cb = callback
  if (typeof options === 'function') {
    cb = options
  }
  process.nextTick(cb, null, hostname)
}

dns.lookup = lookup

module.exports = dns
