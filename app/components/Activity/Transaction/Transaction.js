import React from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber, FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { btc } from 'lib/utils'
import { Message, Text, Value } from 'components/UI'
import messages from './messages'

const Transaction = ({
  transaction,
  ticker,
  currentTicker,
  showActivityModal,
  currencyName,
  intl
}) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    onClick={
      !transaction.sending ? () => showActivityModal('TRANSACTION', transaction.tx_hash) : null
    }
    py={2}
  >
    <Box
      width={3 / 4}
      className="hint--top-right"
      data-hint={intl.formatMessage({ ...messages.type })}
    >
      <Text mb={1}>
        <FormattedMessage {...messages[transaction.received ? 'received' : 'sent']} />
      </Text>

      {transaction.sending ? (
        <>
          {transaction.status === 'sending' && (
            <Message variant="processing">
              <FormattedMessage {...messages.status_processing} />
            </Message>
          )}
          {transaction.status === 'successful' && (
            <Message variant="success">
              <FormattedMessage {...messages.status_success} />
            </Message>
          )}
          {transaction.status === 'failed' && (
            <Message variant="error">
              <FormattedMessage {...messages.status_error} /> {transaction.error}
            </Message>
          )}
        </>
      ) : (
        <Text color="gray" fontSize="xs" fontWeight="normal">
          <FormattedTime value={transaction.time_stamp * 1000} />
        </Text>
      )}
    </Box>

    <Box
      width={1 / 4}
      className="hint--top-left"
      data-hint={intl.formatMessage({ ...messages.amount })}
    >
      <Box css={transaction.status == 'failed' ? { opacity: 0.2 } : null}>
        <Text mb={1} textAlign="right" color={transaction.received ? 'superGreen' : null}>
          {transaction.received ? `+ ` : `- `}
          <Value
            value={transaction.amount}
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
            value={btc.convert(
              'sats',
              'fiat',
              transaction.amount,
              currentTicker[ticker.fiatTicker]
            )}
          />
        </Text>
      </Box>
    </Box>
  </Flex>
)

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  currencyName: PropTypes.string.isRequired
}

export default injectIntl(Transaction)
