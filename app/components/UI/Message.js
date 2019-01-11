import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
import { Spinner } from 'components/UI'
import Success from 'components/Icon/Success'
import Warning from 'components/Icon/Warning'
import Error from 'components/Icon/Error'

import styled from 'styled-components'
import { variant } from 'styled-system'

const messageStyle = variant({ key: 'messages' })
const StyledMessage = styled(Text)(messageStyle)

/**
 * @render react
 * @name Message
 * @example
 * <Message message="Error message" />
 */
class Message extends React.Component {
  static displayName = 'Message'

  static propTypes = {
    variant: PropTypes.string,
    children: PropTypes.node
  }

  renderIcon = () => {
    const { variant } = this.props
    return (
      <Box mr={1} width="14px" css={{ height: '14px' }}>
        {variant === 'success' && <Success height="14px" width="14px" />}
        {variant === 'warning' && <Warning height="14px" width="14px" />}
        {variant === 'error' && <Error height="14px" width="14px" />}
        {variant === 'processing' && <Spinner size="14px" />}
      </Box>
    )
  }

  render() {
    const { children, justifyContent, variant, ...rest } = this.props
    return (
      <StyledMessage fontSize="s" fontWeight="normal" variant={variant} {...rest}>
        <Flex alignItems="center" justifyContent={justifyContent}>
          {this.renderIcon()}
          <Text>{children}</Text>
        </Flex>
      </StyledMessage>
    )
  }
}

export default Message
