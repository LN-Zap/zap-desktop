import React from 'react'
import { Header } from 'components/UI'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const OldWalletHeader = () => (
  <Header
    subtitle={<FormattedMessage {...messages.sync_description} />}
    title={<FormattedMessage {...messages.sync_title} />}
  />
)

export default OldWalletHeader
