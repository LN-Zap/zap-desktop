import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import copy from 'copy-to-clipboard'
import { Bar, DataRow, Button, QRCode, Text, Countdown } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import { intlShape } from '@zap/i18n'
import messages from './messages'

const RequestSummary = ({ invoice = {}, intl, showNotification, ...rest }) => {
  const [isExpired, setIsExpired] = useState(false)

  const {
    value: amountInSats,
    creationDate,
    expiryDate,
    fallbackAddr,
    isKeysend,
    isSettled,
    memo,
    paymentRequest,
    settleDate,
  } = invoice

  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  const getStatusColor = () => {
    if (isSettled) {
      return 'superGreen'
    }
    return isExpired ? 'superRed' : 'primaryAccent'
  }

  return (
    <Box {...rest}>
      <DataRow
        left={<FormattedMessage {...messages.amount} />}
        right={
          <Flex alignItems="center">
            <CryptoSelector mr={2} />
            <CryptoValue fontSize="xxl" value={amountInSats} />
          </Flex>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.created} />}
        right={
          <FormattedTime day="2-digit" month="long" value={creationDate * 1000} year="numeric" />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.current_value} />}
        right={
          <Flex alignItems="center">
            <FiatSelector mr={2} />
            <FiatValue value={amountInSats} />
          </Flex>
        }
      />

      {memo && (
        <>
          <Bar variant="light" />
          <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />
        </>
      )}

      {fallbackAddr && (
        <>
          <Bar variant="light" />
          <DataRow
            left={<FormattedMessage {...messages.fallback_address} />}
            right={fallbackAddr}
          />
        </>
      )}

      <Bar variant="light" />

      <DataRow
        left={
          <>
            <FormattedMessage {...messages.payment_request} />
            {paymentRequest && (
              <>
                <Text
                  className="hint--bottom-left"
                  css="word-wrap: break-word;"
                  data-hint={paymentRequest}
                  fontSize="xs"
                  fontWeight="light"
                  mb={2}
                >
                  <Truncate maxlen={40} text={paymentRequest} />
                </Text>
                <Button onClick={() => copyToClipboard(paymentRequest)} size="small" type="button">
                  <FormattedMessage {...messages.copy_button_text} />
                </Button>
              </>
            )}
          </>
        }
        right={
          <Text>
            {isKeysend ? (
              <FormattedMessage {...messages.payment_request_keysend} />
            ) : (
              <QRCode value={paymentRequest.toUpperCase()} />
            )}
          </Text>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.status} />}
        right={
          isSettled ? (
            <Text
              color={getStatusColor()}
              css="word-break: break-all; text-transform: capitalize;"
              fontWeight="normal"
              textAlign="right"
            >
              <FormattedMessage {...messages.paid} />
              <br />
              <FormattedTime day="2-digit" month="long" value={settleDate * 1000} year="numeric" />
            </Text>
          ) : (
            <>
              <Countdown
                color={getStatusColor()}
                countdownStyle="long"
                isContinual={false}
                offset={new Date(expiryDate * 1000)}
                onExpire={() => setIsExpired(true)}
              />

              <Text color={getStatusColor()} fontWeight="light">
                <FormattedMessage {...messages.not_paid} />
              </Text>
            </>
          )
        }
      />
    </Box>
  )
}

RequestSummary.propTypes = {
  intl: intlShape.isRequired,
  invoice: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(RequestSummary)
