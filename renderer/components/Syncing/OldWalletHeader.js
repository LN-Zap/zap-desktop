import React from 'react'

import { FormattedMessage } from 'react-intl'

import { Header } from 'components/UI'

import messages from './messages'

const OldWalletHeader = () => (
  <Header
    subtitle={<FormattedMessage {...messages.sync_description} />}
    title={<FormattedMessage {...messages.sync_title} />}
  />
)

export default OldWalletHeader
