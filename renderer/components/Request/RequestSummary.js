import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { FormattedMessage, FormattedTime, injectIntl } from 'react-intl'
import copy from 'copy-to-clipboard'
import { decodePayReq } from '@zap/utils/crypto'
import getUnixTime from '@zap/utils/time'
import { Bar, DataRow, Button, QRCode, Text, Countdown } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import { intlShape } from '@zap/i18n'
import messages from './messages'

const RequestSummary = ({ invoice = {}, payReq, intl, showNotification, ...rest }) => {
  const decodedInvoice = useMemo(() => decodePayReq(payReq), [payReq])
  const [isExpired, setIsExpired] = useState(false)
  const [expiryDelta, setExpiryDelta] = useState(
    decodedInvoice.timeExpireDate - getUnixTime() / 1000
  )

  useEffect(() => {
    setExpiryDelta(decodedInvoice.timeExpireDate - getUnixTime() / 1000)
    return () => {
      setIsExpired(false)
    }
  }, [decodedInvoice])

  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  const { satoshis: invoiceAmount, tags } = decodedInvoice
  const satoshis = invoice.finalAmount || invoiceAmount || 0
  const descriptionTag = tags.find(tag => tag.tagName === 'description') || {}
  const memo = descriptionTag.data

  const fallbackTag = tags.find(tag => tag.tagName === 'fallback_address')
  const fallback = fallbackTag && fallbackTag.data.address

  const getStatusColor = () => {
    if (invoice.settled) {
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
            <CryptoValue fontSize="xxl" value={satoshis} />
          </Flex>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.current_value} />}
        right={
          <Flex alignItems="center">
            <FiatSelector mr={2} />
            <FiatValue value={satoshis} />
          </Flex>
        }
      />

      {memo && (
        <>
          <Bar variant="light" />
          <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />
        </>
      )}

      {fallback && (
        <>
          <Bar variant="light" />
          <DataRow left={<FormattedMessage {...messages.fallback_address} />} right={fallback} />
        </>
      )}

      <Bar variant="light" />

      <DataRow
        left={
          <React.Fragment>
            <FormattedMessage {...messages.payment_request} />
            <Text
              className="hint--bottom-left"
              css="word-wrap: break-word;"
              data-hint={payReq}
              fontSize="xs"
              fontWeight="light"
              mb={2}
            >
              <Truncate maxlen={40} text={payReq} />
            </Text>
            <Button onClick={() => copyToClipboard(payReq)} size="small" type="button">
              <FormattedMessage {...messages.copy_button_text} />
            </Button>
          </React.Fragment>
        }
        right={
          <Text>
            <QRCode value={payReq} />
          </Text>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.status} />}
        right={
          invoice.settled ? (
            <Text
              color={getStatusColor()}
              css="word-break: break-all; text-transform: capitalize;"
              fontWeight="normal"
              textAlign="right"
            >
              <FormattedMessage {...messages.paid} />
              <br />
              <FormattedTime
                day="2-digit"
                month="long"
                value={invoice.settle_date * 1000}
                year="numeric"
              />
            </Text>
          ) : (
            <>
              <Countdown
                color={getStatusColor()}
                countdownStyle="long"
                isContinual={false}
                offset={expiryDelta}
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
  invoice: PropTypes.object,
  payReq: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(RequestSummary)
