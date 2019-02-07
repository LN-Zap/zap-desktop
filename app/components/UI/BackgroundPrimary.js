import React from 'react'
import { Flex } from 'rebass'

/**
 * @render react
 * @name BackgroundPrimary
 * @example
 * <BackgroundPrimary />
 */
class BackgroundPrimary extends React.Component {
  render() {
    return <Flex flexDirection="column" bg="primaryColor" color="primaryText" {...this.props} />
  }
}

export default BackgroundPrimary
