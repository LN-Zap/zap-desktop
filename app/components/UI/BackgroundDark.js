import React from 'react'
import { Box } from 'rebass'

/**
 * @render react
 * @name BackgroundDark
 * @example
 * <BackgroundDark />
 */
class BackgroundDark extends React.Component {
  render() {
    return <Box bg="darkestBackground" color="white" {...this.props} />
  }
}

export default BackgroundDark
