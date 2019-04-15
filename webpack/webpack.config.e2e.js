/**
 * Webpack config for use with testcafe (e2e).
 */

import prodConfig from './webpack.config.prod'

// Disable minification for compatibility with testcafe-react-selectors.
prodConfig.map(config => {
  config.optimization.minimizer = []
  return config
})

export default prodConfig
