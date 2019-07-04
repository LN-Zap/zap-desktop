import React from 'react'
import { Flex } from 'rebass'

/**
 * @name BackgroundPrimary
 * @example
 * <BackgroundPrimary />
 */
class BackgroundPrimary extends React.Component {
  render() {
    return <Flex bg="primaryColor" color="primaryText" flexDirection="column" {...this.props} />
  }
}

export default BackgroundPrimary
