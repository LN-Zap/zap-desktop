import React from 'react'

import { FormattedMessage } from 'react-intl'

import { Button } from 'components/UI'

import messages from './messages'

const ChannelMoreButton = props => (
  <Button size="small" type="button" {...props}>
    <FormattedMessage {...messages.more_button_text} />
  </Button>
)
export default ChannelMoreButton
