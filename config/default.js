const semver = require('semver')
const { getPackageDetails } = require('../app/lib/utils')

const { version } = getPackageDetails()

module.exports = {
  db: {
    namespace: 'ZapDesktop',
    domain: semver.lt(version, '0.4.0-alpha') ? null : 'next'
  }
}
