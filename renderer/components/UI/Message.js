import React from 'react'

import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass/styled-components'

import Error from 'components/Icon/Error'
import Success from 'components/Icon/Success'
import Warning from 'components/Icon/Warning'

import Spinner from './Spinner'

const Icon = ({ type }) => {
  switch (type) {
    case 'success':
      return <Success height="14px" width="14px" />
    case 'warning':
      return <Warning height="14px" width="14px" />
    case 'error':
      return <Error height="14px" width="14px" />
    case 'processing':
      return <Spinner size="14px" />
    default:
      return null
  }
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
}

const Message = ({ children, justifyContent, variant, ...rest }) => (
  <Box fontSize="s" fontWeight="normal" variant={`message.${variant}`} {...rest}>
    <Flex alignItems="flex-start" justifyContent={justifyContent}>
      <Box mr={2}>
        <Icon type={variant} />
      </Box>
      <Text flex={1} lineHeight="normal">
        {children}
      </Text>
    </Flex>
  </Box>
)

Message.propTypes = {
  children: PropTypes.node,
  justifyContent: PropTypes.string,
  variant: PropTypes.string,
}

Message.defaultProps = {
  variant: 'success',
}

export default Message
