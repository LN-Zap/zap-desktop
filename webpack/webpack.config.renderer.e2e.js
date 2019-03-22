/**
 * Build config for electron renderer process (e2e)
 */

import merge from 'webpack-merge'
import rendererProdConf from './webpack.config.renderer.prod'

// Disable minification for compatibility with testcafe-react-selectors.
export default merge.smart(rendererProdConf, {
  optimization: {
    minimizer: [],
  },
})
