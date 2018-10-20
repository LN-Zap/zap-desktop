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
      <BaseText lineHeight="1.4" fontSize="m" color="primaryText" {...this.props}>
        {children}
      </BaseText>
    )
  }
}

export default Text
