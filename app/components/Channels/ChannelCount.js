import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Text } from 'components/UI'
import messages from './messages'

const ChannelCount = ({ channels, ...rest }) => {
  return (
    <Flex as="section" alignItems="center" {...rest}>
      <Text fontWeight="normal" mr={2}>
        <FormattedMessage {...messages.channels} />
      </Text>
      <Text>{channels.length}</Text>
    </Flex>
  )
}

ChannelCount.propTypes = {
  channels: PropTypes.array.isRequired
}

export default ChannelCount
