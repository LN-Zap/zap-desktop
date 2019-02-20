import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Button } from 'components/UI'
import messages from './messages'

const ChannelFooter = ({ channel, closeChannel }) => {
  return (
    <Flex alignItems="center" justifyContent="center">
      {channel.can_close && (
        <Button variant="danger" onClick={closeChannel}>
          <FormattedMessage {...messages[channel.active ? 'close_button' : 'force_close_button']} />
        </Button>
      )}
    </Flex>
  )
}

ChannelFooter.propTypes = {
  channel: PropTypes.object.isRequired,
  closeChannel: PropTypes.func.isRequired
}

export default ChannelFooter
