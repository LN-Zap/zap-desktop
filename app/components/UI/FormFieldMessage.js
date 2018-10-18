import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import SystemSuccess from 'components/Icon/SystemSuccess'
import SystemWarning from 'components/Icon/SystemWarning'
import SystemError from 'components/Icon/SystemError'

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
    const { children, variant } = this.props
    return (
      <Message {...this.props} variant={variant}>
        <Box mr={1}>
          {variant === 'success' && <SystemSuccess />}
          {variant === 'warning' && <SystemWarning />}
          {variant === 'error' && <SystemError />}
        </Box>
        {children}
      </Message>
    )
  }
}

export default FormFieldMessage
