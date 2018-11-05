import React from 'react'
import { Card } from 'rebass'

/**
 * @render react
 * @name Bar
 * @example
 * <Bar />
 */
class Bar extends React.PureComponent {
  render() {
    return (
      <Card
        width={1}
        {...this.props}
        borderColor="primaryText"
        opacity={0.6}
        border={1}
        m={0}
        p={0}
        css={{ 'border-bottom': 'none !important' }}
        as="hr"
      />
    )
  }
}

export default Bar
