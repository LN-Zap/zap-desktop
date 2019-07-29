import { install } from 'lnd-binary'

/**
 * installLnd - Install lnd for a given platform and architecture.
 *
 * @param  {string} platform Platform
 * @param  {string} arch     Architecture
 * @param  {string} dest     Destination
 * @returns {Promise} resolves after install is complete
 */
function installLnd(platform, arch, dest) {
  process.env.LND_BINARY_PLATFORM = platform
  process.env.LND_BINARY_ARCH = arch
  process.env.LND_BINARY_DIR = dest

  return install()
}

installLnd('darwin', 'amd64', 'resources/bin/mac/x64')
  .then(() => installLnd('windows', 'amd64', 'resources/bin/win/x64'))
  .then(() => installLnd('linux', 'amd64', 'resources/bin/linux/x64'))
  .catch(e => {
    // eslint-disable-next-line no-console
    console.warn(e)
    process.exit(1)
  })
