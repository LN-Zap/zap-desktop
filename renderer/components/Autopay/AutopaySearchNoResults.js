import React from 'react'

import { FormattedMessage } from 'react-intl'

import { Text } from 'components/UI'

import messages from './messages'

const AutopaySearchNoResults = props => (
  <Text color="gray" {...props}>
    <FormattedMessage {...messages.search_no_Results} />
  </Text>
)

export default AutopaySearchNoResults
