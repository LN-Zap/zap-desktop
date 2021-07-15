import React from 'react'

import { Box } from 'rebass/styled-components'

/**
 * @name BackgroundTertiary
 * @example
 * <BackgroundTertiary />
 */
class BackgroundTertiary extends React.Component {
  render() {
    return <Box bg="tertiaryColor" color="primaryText" {...this.props} />
  }
}

export default BackgroundTertiary
