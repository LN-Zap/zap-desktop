import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import { ProgressBar, Text } from 'components/UI'
import { CryptoSelector, CryptoValue } from 'containers/UI'

const ChannelsCapacity = ({ message, capacity, color, ...rest }) => {
  return (
    <Flex alignItems="center" as="section" {...rest}>
      {message && (
        <Text fontWeight="normal" mr={2}>
          {message}
        </Text>
      )}
      <ProgressBar color={color} height="100%" progress={1}>
        <Text fontWeight="normal" px={2}>
          <CryptoValue value={capacity} />
        </Text>
      </ProgressBar>
      <CryptoSelector ml={2} />
    </Flex>
  )
}

ChannelsCapacity.propTypes = {
  capacity: PropTypes.string.isRequired,
  color: PropTypes.string,
  message: PropTypes.node,
}

export default ChannelsCapacity
