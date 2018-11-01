import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass'
import Success from 'components/Icon/Success'
import Warning from 'components/Icon/Warning'
import Error from 'components/Icon/Error'

import styled from 'styled-components'
import { variant } from 'styled-system'

const messageStyle = variant({ key: 'messages' })
const Message = styled(Flex)(messageStyle)

/**
 * @render react
 * @name FormFieldMessage
 * @example
 * <FormFieldMessage message="Error message" />
 */
class FormFieldMessage extends React.Component {
  static displayName = 'FormFieldMessage'

  static propTypes = {
    variant: PropTypes.string,
    children: PropTypes.node
  }

  render() {
    const { children, variant, ...rest } = this.props
    return (
      <Message {...rest} variant={variant} alignItems="center">
        <Box mr={1}>
          {variant === 'success' && <Success />}
          {variant === 'warning' && <Warning />}
          {variant === 'error' && <Error />}
        </Box>
        <Text fontSize="s" fontWeight="normal">
          {children}
        </Text>
      </Message>
    )
  }
}

export default FormFieldMessage
