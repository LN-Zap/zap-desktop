import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass'
import { Header } from 'components/UI'
import LightningChannel from 'components/Icon/LightningChannel'
import messages from './messages'

const ChannelCreateHeader = props => (
  <Box {...props}>
    <Header
      title={<FormattedMessage {...messages.open_channel_form_title} />}
      subtitle={<FormattedMessage {...messages.open_channel_form_subtitle} />}
      logo={<LightningChannel height="48px" width="48px" />}
    />
  </Box>
)

export default ChannelCreateHeader
