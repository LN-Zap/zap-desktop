import React from 'react'
import PropTypes from 'prop-types'
import { Text as BaseText } from 'rebass'
import styled from 'styled-components'
import { opacity } from 'styled-system'

const StyledText = styled(BaseText)(opacity)

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
      <StyledText lineHeight="1.4" fontSize="m" color="primaryText" {...this.props}>
        {children}
      </StyledText>
    )
  }
}

export default Text
