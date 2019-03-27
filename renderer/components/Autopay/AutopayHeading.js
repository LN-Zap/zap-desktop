import React from 'react'
import { FormattedMessage, intlShape, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Heading } from 'components/UI'
import Autopay from 'components/Icon/Autopay'
import messages from './messages'

const AutopayHeading = ({ intl, ...rest }) => (
  <Flex alignItems="baseline" {...rest}>
    <Heading.h1 fontSize="xxxl" mr={2}>
      <FormattedMessage {...messages.title} />
    </Heading.h1>
    <Box alignSelf="flex-start">
      <Autopay height={28} width={28} />
    </Box>
    <Heading.h1>
      <FormattedMessage {...messages.subtitle} />
    </Heading.h1>
  </Flex>
)

AutopayHeading.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(AutopayHeading)
