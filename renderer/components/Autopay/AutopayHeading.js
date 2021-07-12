import React from 'react'

import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import Autopay from 'components/Icon/Autopay'
import { Heading } from 'components/UI'

import messages from './messages'

const AutopayHeading = ({ ...rest }) => (
  <Flex alignItems="baseline" {...rest}>
    <Heading.H1 fontSize="xxxl" mr={2}>
      <FormattedMessage {...messages.title} />
    </Heading.H1>
    <Box alignSelf="flex-start">
      <Autopay height={28} width={28} />
    </Box>
    <Heading.H1>
      <FormattedMessage {...messages.subtitle} />
    </Heading.H1>
  </Flex>
)

export default AutopayHeading
