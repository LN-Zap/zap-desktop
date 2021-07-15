import React from 'react'

import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass/styled-components'

import LightningChannel from 'components/Icon/LightningChannel'
import { Header } from 'components/UI'

import messages from './messages'

const ChannelCreateHeader = props => (
  <Box {...props}>
    <Header
      logo={<LightningChannel height="48px" width="48px" />}
      title={<FormattedMessage {...messages.open_channel_form_title} />}
    />
  </Box>
)

export default ChannelCreateHeader
