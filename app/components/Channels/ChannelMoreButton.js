import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'components/UI'
import messages from './messages'

const ChannelMoreButton = props => (
  <Button type="button" size="small" {...props}>
    <FormattedMessage {...messages.more_button_text} />
  </Button>
)
export default ChannelMoreButton
