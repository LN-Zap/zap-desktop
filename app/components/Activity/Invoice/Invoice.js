import React from 'react'
import PropTypes from 'prop-types'
import { FormattedTime, FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'
import { CryptoValue, FiatValue } from 'containers/UI'
import messages from './messages'

const Invoice = ({ invoice, showActivityModal, currencyName, intl }) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    onClick={() => showActivityModal('INVOICE', invoice.payment_request)}
    py={2}
  >
    <Box
      width={3 / 4}
      className="hint--top-right"
      data-hint={intl.formatMessage({ ...messages[invoice.settled ? 'type_paid' : 'type_unpaid'] })}
    >
      <Text mb={1}>
        <FormattedMessage {...messages[invoice.settled ? 'received' : 'requested']} />
      </Text>
      <Text color="gray" fontSize="xs" fontWeight="normal">
        <FormattedTime
          value={invoice.settled ? invoice.settle_date * 1000 : invoice.creation_date * 1000}
        />
      </Text>
    </Box>

    <Box
      width={1 / 4}
      className="hint--top-left"
      data-hint={intl.formatMessage({ ...messages.amount })}
    >
      <Text mb={1} textAlign="right" color="superGreen">
        {'+ '}
        <CryptoValue value={invoice.value} />
        <i> {currencyName}</i>
      </Text>
      <Text textAlign="right" color="gray" fontSize="xs" fontWeight="normal">
        <FiatValue value={invoice.value} style="currency" />
      </Text>
    </Box>
  </Flex>
)

Invoice.propTypes = {
  intl: intlShape.isRequired,
  invoice: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  currencyName: PropTypes.string.isRequired
}

export default injectIntl(Invoice)
