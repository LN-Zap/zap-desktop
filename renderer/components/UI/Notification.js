import React, { useState, useCallback } from 'react'

import PropTypes from 'prop-types'
import { Box, Flex, Text } from 'rebass/styled-components'

import Error from 'components/Icon/Error'
import Success from 'components/Icon/Success'
import Warning from 'components/Icon/Warning'
import X from 'components/Icon/X'

import Spinner from './Spinner'

const Icon = ({ type }) => {
  switch (type) {
    case 'success':
      return <Success />
    case 'warning':
      return <Warning />
    case 'error':
      return <Error />
    default:
      return null
  }
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
}

const Notification = ({ children, variant, isProcessing, sx, ...rest }) => {
  const [isHover, setHover] = useState(false)
  const hoverOn = useCallback(() => {
    setHover(true)
  }, [])
  const hoverOff = useCallback(() => {
    setHover(false)
  }, [])

  return (
    <Box
      onMouseEnter={hoverOn}
      onMouseLeave={hoverOff}
      {...rest}
      sx={{
        borderRadius: 's',
        boxShadow: 's',
        cursor: 'pointer',
        px: 3,
        py: 3,
        ...sx,
      }}
      variant={`notification.${variant}`}
    >
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Text fontSize="xl">
            {isProcessing && <Spinner height="0.9em" width="0.9em" />}

            {!isProcessing && variant === 'success' && <Success />}
            {!isProcessing && variant === 'warning' && <Warning />}
            {!isProcessing && variant === 'error' && <Error />}
          </Text>
          <Text fontWeight="normal" ml={2}>
            {children}
          </Text>
        </Flex>
        <Text fontSize="xs" mt={1}>
          <X strokeWidth={isHover ? 5 : 4} />
        </Text>
      </Flex>
    </Box>
  )
}

Notification.defaultProps = {
  variant: 'success',
}

Notification.propTypes = {
  children: PropTypes.node,
  isProcessing: PropTypes.bool,
  sx: PropTypes.object,
  variant: PropTypes.string,
}

export default Notification
