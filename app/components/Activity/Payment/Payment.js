import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { btc } from 'lib/utils'
import { Message, Span, Text, Value } from 'components/UI'
import { FormattedNumber, FormattedTime, injectIntl } from 'react-intl'
import messages from './messages'

const Payment = ({
  payment,
  ticker,
  currentTicker,
  showActivityModal,
  nodes,
  currencyName,
  intl
}) => {
  const displayNodeName = pubkey => {
    const node = nodes.find(n => pubkey === n.pub_key)
    if (node && node.alias.length) {
      return node.alias
    }
    return pubkey.substring(0, 10)
  }

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      onClick={!payment.sending ? () => showActivityModal('PAYMENT', payment.payment_hash) : null}
      py={2}
    >
      <Box
        width={3 / 4}
        className="hint--top-right"
        data-hint={intl.formatMessage({ ...messages.type })}
      >
        <Text mb={1}>{displayNodeName(payment.path[payment.path.length - 1])}</Text>
        {payment.sending ? (
          <>
            {payment.status === 'sending' && (
              <Message variant="processing">
                Zap is processing your payment. This can take up to 01:00 min.
              </Message>
            )}
            {payment.status === 'successful' && (
              <Message variant="success">Your payment was successful.</Message>
            )}
            {payment.status === 'failed' && (
              <Message variant="error">
                There was a problem sending your payment. {payment.error}
              </Message>
            )}
          </>
        ) : (
          <Text color="gray" fontSize="xs" fontWeight="normal">
            <FormattedTime value={payment.creation_date * 1000} />
          </Text>
        )}
      </Box>

      <Box
        width={1 / 4}
        className="hint--top-left"
        data-hint={intl.formatMessage({ ...messages.amount })}
      >
        <Box css={payment.status == 'failed' ? { opacity: 0.5 } : null}>
          <Text mb={1} textAlign="right">
            {payment.status !== 'failed' && (
              <Span color="superRed" fontWeight="normal" mr={1}>
                -
              </Span>
            )}
            <Value
              value={payment.value}
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
              value={btc.convert('sats', 'fiat', payment.value, currentTicker[ticker.fiatTicker])}
            />
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

Payment.propTypes = {
  currencyName: PropTypes.string.isRequired,
  payment: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
}

export default injectIntl(Payment)
