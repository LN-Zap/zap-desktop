import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { StatusIndicator, Text } from 'components/UI'

const LoadingChannels = ({ message, name, ...rest }) => (
  <Flex as="header" alignItems="center" py={2} my={1} mx={3} css={{ cursor: 'pointer' }} {...rest}>
    <Text mr={2} fontSize="xs" className="hint--right" data-hint={message}>
      <StatusIndicator variant="loading" />
    </Text>
    <Text>{name}</Text>
  </Flex>
)

LoadingChannels.propTypes = {
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default LoadingChannels
