import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import { intlShape } from '@zap/i18n'
import { Heading } from 'components/UI'
import Autopay from 'components/Icon/Autopay'
import messages from './messages'

const AutopayHeading = ({ intl, ...rest }) => (
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

AutopayHeading.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(AutopayHeading)
