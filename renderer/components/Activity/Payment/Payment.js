import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedTime, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Message, Text } from 'components/UI'
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
      alignItems="center"
      justifyContent="space-between"
      onClick={payment.sending ? null : () => showActivityModal('PAYMENT', payment.payment_hash)}
      py={2}
    >
      <Box
        className="hint--top-right"
        data-hint={intl.formatMessage({ ...messages.type })}
        width={3 / 4}
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
        className="hint--top-left"
        data-hint={intl.formatMessage({ ...messages.amount })}
        width={1 / 4}
      >
        <Box css={payment.status == 'failed' ? { opacity: 0.3 } : null}>
          <Text mb={1} textAlign="right">
            {'- '}
            <CryptoValue value={payment.value} />
            <i> {currencyName}</i>
          </Text>
          <Text color="gray" fontSize="xs" fontWeight="normal" textAlign="right">
            <FiatValue style="currency" value={payment.value} />
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

Payment.propTypes = {
  currencyName: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  nodes: PropTypes.array.isRequired,
  payment: PropTypes.object.isRequired,
  showActivityModal: PropTypes.func.isRequired,
}

export default injectIntl(Payment)
