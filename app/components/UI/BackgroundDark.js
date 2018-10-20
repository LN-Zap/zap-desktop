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
    return <Box bg="darkestBackground" color="primaryText" {...this.props} />
  }
}

export default BackgroundDark
