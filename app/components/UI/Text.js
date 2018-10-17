import React from 'react'
import PropTypes from 'prop-types'
import { Text as BaseText } from 'rebass'

/**
 * @render react
 * @name Text
 * @example
 * <Text>Some text</Text>
 */
class Text extends React.PureComponent {
  static displayName = 'Text'

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { children } = this.props
    return (
      <BaseText fontSize="m" {...this.props}>
        {children}
      </BaseText>
    )
  }
}

export default Text
