const lndBinary = require('lnd-binary')

function install(platform, arch, dest) {
  process.env.LND_BINARY_PLATFORM = platform
  process.env.LND_BINARY_ARCH = arch
  process.env.LND_BINARY_DIR = dest

  return lndBinary.install()
}

return install('darwin', 'amd64', 'resources/bin/mac/x64')
  .then(() => install('darwin', '386', 'resources/bin/mac/ia32'))
  .then(() => install('windows', 'amd64', 'resources/bin/win/x64'))
  .then(() => install('windows', '386', 'resources/bin/win/ia32'))
  .then(() => install('linux', 'amd64', 'resources/bin/linux/x64'))
  .then(() => install('linux', '386', 'resources/bin/linux/ia32'))
