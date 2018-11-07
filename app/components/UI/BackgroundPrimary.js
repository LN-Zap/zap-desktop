import React from 'react'
import { Box } from 'rebass'

/**
 * @render react
 * @name BackgroundPrimary
 * @example
 * <BackgroundPrimary />
 */
class BackgroundPrimary extends React.Component {
  render() {
    return <Box bg="primaryColor" color="primaryText" {...this.props} />
  }
}

export default BackgroundPrimary
