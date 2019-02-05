import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Message, Span, Text } from 'components/UI'
import { CryptoValue, FiatValue } from 'containers/UI'
import messages from './messages'

const Payment = ({ payment, showActivityModal, nodes, currencyName, intl }) => {
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
                <FormattedMessage {...messages.status_processing} />
              </Message>
            )}
            {payment.status === 'successful' && (
              <Message variant="success">
                <FormattedMessage {...messages.status_success} />
              </Message>
            )}
            {payment.status === 'failed' && (
              <Message variant="error">
                <FormattedMessage {...messages.status_error} />
                {` `}
                {payment.error}
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
            <CryptoValue value={payment.value} />
            <i> {currencyName}</i>
          </Text>
          <Text textAlign="right" color="gray" fontSize="xs" fontWeight="normal">
            <FiatValue value={payment.value} style="currency" />
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

Payment.propTypes = {
  currencyName: PropTypes.string.isRequired,
  payment: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  showActivityModal: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
}

export default injectIntl(Payment)
