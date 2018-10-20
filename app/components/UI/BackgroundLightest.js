import React from 'react'
import { Box } from 'rebass'

/**
 * @render react
 * @name BackgroundLightest
 * @example
 * <BackgroundLightest />
 */
class BackgroundLightest extends React.Component {
  render() {
    return <Box bg="lightestBackground" color="primaryText" {...this.props} />
  }
}

export default BackgroundLightest
