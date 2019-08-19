import React from 'react'
import PropTypes from 'prop-types'
import { FormattedTime, FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import { intlShape } from '@zap/i18n'
import { Message, Text } from 'components/UI'
import { CryptoValue, FiatValue } from 'containers/UI'
import ErrorLink from '../ErrorLink'
import messages from './messages'

const Transaction = ({ transaction, showActivityModal, cryptoUnitName, intl }) => {
  const amount = transaction.amount || transaction.limboAmount || 0
  const isIncoming = transaction.received || transaction.limboAmount > 0
  let type = isIncoming ? 'received' : 'sent'
  if (transaction.isFunding) {
    type = 'funding'
  } else if (transaction.isClosing) {
    type = 'closing'
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      onClick={
        transaction.sending ? null : () => showActivityModal('TRANSACTION', transaction.tx_hash)
      }
      py={2}
    >
      <Box
        className="hint--top-right"
        data-hint={intl.formatMessage({ ...messages.type })}
        width={3 / 4}
      >
        <Text mb={1}>
          {transaction.closeType ? (
            <FormattedMessage {...messages[`closetype_${transaction.closeType.toLowerCase()}`]} />
          ) : (
            <FormattedMessage {...messages[type]} />
          )}
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
              <ErrorLink>
                <FormattedMessage {...messages.status_error} />
              </ErrorLink>
            )}
          </>
        ) : (
          <Text color="gray" fontSize="xs" fontWeight="normal">
            <FormattedTime value={transaction.time_stamp * 1000} />
          </Text>
        )}
      </Box>

      <Box
        className="hint--top-left"
        data-hint={intl.formatMessage({ ...messages.amount })}
        width={1 / 4}
      >
        <Box css={transaction.status == 'failed' ? { opacity: 0.2 } : null}>
          <Text color={isIncoming ? 'superGreen' : null} mb={1} textAlign="right">
            {isIncoming ? `+ ` : `- `}
            <CryptoValue value={amount} />
            <i> {cryptoUnitName}</i>
          </Text>
          <Text color="gray" fontSize="xs" fontWeight="normal" textAlign="right">
            <FiatValue style="currency" value={amount} />
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

Transaction.displayName = 'Transaction'

Transaction.propTypes = {
  cryptoUnitName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
}

export default injectIntl(Transaction)
