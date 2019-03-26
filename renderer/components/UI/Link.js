import React from 'react'
import PropTypes from 'prop-types'
import Text from './Text'

/**
 * @render react
 * @name Link
 * @example
 * <Link>Some text</Link>
 */
class Link extends React.PureComponent {
  static displayName = 'Link'

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props
    return (
      <Text as="a" css={{ cursor: 'pointer', 'text-decoration': 'underline' }} {...this.props}>
        {children}
      </Text>
    )
  }
}

export default Link
