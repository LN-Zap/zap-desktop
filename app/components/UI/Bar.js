import React from 'react'
import { Box } from 'rebass'

/**
 * @render react
 * @name Bar
 * @example
 * <Bar />
 */
class Bar extends React.PureComponent {
  render() {
    return <Box width={1} bg="white" css={{ height: '1px' }} {...this.props} as="hr" />
  }
}

export default Bar
