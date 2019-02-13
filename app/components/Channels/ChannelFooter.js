import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Button } from 'components/UI'
import ArrowLeft from 'components/Icon/ArrowLeft'
import messages from './messages'

const ChannelFooter = ({ channel, setSelectedChannel, closeChannel }) => {
  return (
    <Flex alignItems="center">
      <Box width={1 / 4}>
        <Button type="button" variant="secondary" onClick={() => setSelectedChannel(null)}>
          <Flex>
            <Box>
              <ArrowLeft />
            </Box>
            <Box ml={1}>
              <FormattedMessage {...messages.back_button} />
            </Box>
          </Flex>
        </Button>
      </Box>

      <Flex width={2 / 4} alignItems="center" justifyContent="center">
        {channel.can_close && (
          <Button
            variant="danger"
            onClick={() =>
              closeChannel({
                channel_point: channel.channel_point,
                chan_id: channel.chan_id,
                force: !channel.active
              })
            }
          >
            <FormattedMessage
              {...messages[channel.active ? 'close_button' : 'force_close_button']}
            />
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

ChannelFooter.propTypes = {
  channel: PropTypes.object.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  closeChannel: PropTypes.func.isRequired
}

export default ChannelFooter
