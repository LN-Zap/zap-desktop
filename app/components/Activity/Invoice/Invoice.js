import React from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber, FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { btc } from 'lib/utils'
import { Text, Value } from 'components/UI'
import messages from './messages'

const Invoice = ({ invoice, ticker, currentTicker, showActivityModal, currencyName, intl }) => (
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
        <Value
          value={invoice.value}
          currency={ticker.currency}
          currentTicker={currentTicker}
          fiatTicker={ticker.fiatTicker}
        />
        <i> {currencyName}</i>
      </Text>
      <Text textAlign="right" color="gray" fontSize="xs" fontWeight="normal">
        <FormattedNumber
          currency={ticker.fiatTicker}
          style="currency"
          value={btc.convert('sats', 'fiat', invoice.value, currentTicker[ticker.fiatTicker])}
        />
      </Text>
    </Box>
  </Flex>
)

Invoice.propTypes = {
  invoice: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  currencyName: PropTypes.string.isRequired
}

export default injectIntl(Invoice)
