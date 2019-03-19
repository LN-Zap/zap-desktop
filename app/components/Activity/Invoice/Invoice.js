import React from 'react'
import PropTypes from 'prop-types'
import { FormattedTime, FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'
import { CryptoValue, FiatValue } from 'containers/UI'
import messages from './messages'

const Invoice = ({ invoice, showActivityModal, currencyName, intl }) => (
  <Flex
    alignItems="center"
    justifyContent="space-between"
    onClick={() => showActivityModal('INVOICE', invoice.payment_request)}
    py={2}
  >
    <Box
      className="hint--top-right"
      data-hint={intl.formatMessage({ ...messages[invoice.settled ? 'type_paid' : 'type_unpaid'] })}
      width={3 / 4}
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
      className="hint--top-left"
      data-hint={intl.formatMessage({ ...messages.amount })}
      width={1 / 4}
    >
      <Text color="superGreen" mb={1} textAlign="right">
        {'+ '}
        <CryptoValue value={invoice.value} />
        <i> {currencyName}</i>
      </Text>
      <Text color="gray" fontSize="xs" fontWeight="normal" textAlign="right">
        <FiatValue style="currency" value={invoice.value} />
      </Text>
    </Box>
  </Flex>
)

Invoice.propTypes = {
  currencyName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  invoice: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
}

export default injectIntl(Invoice)
