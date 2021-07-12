/**
 * Webpack config for use with testcafe (e2e).
 */

import os from 'os'
import path from 'path'

import prodConfig from './webpack.config.prod'

// Disable minification for compatibility with testcafe-react-selectors.
prodConfig.map(config => {
  config.optimization.minimizer = []

  return config
})
// patch mainConfig. use mock keytar on linux
// TODO remove and add support for linux in e2e
if (os.platform() === 'linux') {
  prodConfig[2].resolve.alias.keytar = path.resolve(__dirname, '../test/unit/__mocks__/keytar')
}

export default prodConfig
