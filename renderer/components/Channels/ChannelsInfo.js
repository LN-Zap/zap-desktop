import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Card } from 'components/UI'

import ChannelsCapacity from './ChannelsCapacity'
import ChannelsSummaryDonut from './ChannelsSummaryDonut'
import messages from './messages'

const ChannelsInfo = ({ receiveCapacity, sendCapacity, ...rest }) => {
  const hasCapacity = Boolean(receiveCapacity || sendCapacity)
  return (
    <Card pb={2} pt={2} px={3} width={1} {...rest}>
      <Flex alignItems="center" as="section" justifyContent="space-between" mt={2}>
        <Flex alignItems="center" as="section">
          {hasCapacity && (
            <ChannelsSummaryDonut
              mr={3}
              receiveCapacity={receiveCapacity}
              sendCapacity={sendCapacity}
              width={40}
            />
          )}
          <ChannelsCapacity
            capacity={sendCapacity}
            message={<FormattedMessage {...messages.total_capacity_send} />}
            mr={3}
            my={2}
          />
          <ChannelsCapacity
            capacity={receiveCapacity}
            color="superBlue"
            message={<FormattedMessage {...messages.total_capacity_receive} />}
            my={2}
          />
        </Flex>
      </Flex>
    </Card>
  )
}

ChannelsInfo.propTypes = {
  receiveCapacity: PropTypes.string.isRequired,
  sendCapacity: PropTypes.string.isRequired,
}

export default ChannelsInfo
