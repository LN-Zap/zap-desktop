import React, { useState, useEffect, useRef } from 'react'
import createScheduler from '@zap/utils/scheduler'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import {
  FormattedMessage,
  FormattedRelative,
  FormattedTime,
  intlShape,
  injectIntl,
} from 'react-intl'
import { decodePayReq } from '@zap/utils/crypto'
import copy from 'copy-to-clipboard'
import { Bar, DataRow, Button, QRCode, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

const RequestSummary = ({ invoice = {}, payReq, intl, showNotification, ...rest }) => {
  const [isExpired, setIsExpired] = useState()

  const scheduler = useRef(createScheduler())
  const decodedInvoice = decodePayReq(payReq)

  // Set up scheduler to recheck expired state every second.
  useEffect(() => {
    const schedulerInstance = scheduler.current

    const refreshIsExpired = () => {
      const expiresIn = decodedInvoice.timeExpireDate * 1000 - Date.now()
      const isInvoiceExpired = Boolean(expiresIn <= 0)
      isInvoiceExpired && setIsExpired(true)
    }

    refreshIsExpired()

    if (isExpired) {
      schedulerInstance.removeAllTasks()
    } else {
      schedulerInstance.addTask({
        task: refreshIsExpired,
        baseDelay: 1000,
      })
    }
    // Clear scheduler on unmount.
    return () => {
      schedulerInstance.removeAllTasks()
    }
  }, [isExpired, decodedInvoice])

  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  const { satoshis: invoiceAmount, tags } = decodedInvoice
  const satoshis = invoice.finalAmount || invoiceAmount || 0
  const descriptionTag = tags.find(tag => tag.tagName === 'description') || {}
  const memo = descriptionTag.data

  const getStatusColor = () => {
    if (invoice.settled) {
      return 'superGreen'
    }
    return isExpired ? 'superRed' : 'lightningOrange'
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

      <Bar variant="light" />

      <DataRow
        left={
          <React.Fragment>
            <FormattedMessage {...messages.payment_request} />
            <Text
              className="hint--bottom-left"
              css={`
                word-wrap: break-word;
              `}
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
              css={`
                word-break: break-all;
                text-transform: capitalize;
              `}
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
              <Text color={getStatusColor()} fontWeight="normal">
                {isExpired ? 'Expired ' : 'Expires '}
                <FormattedRelative
                  updateInterval={1000}
                  value={decodedInvoice.timeExpireDateString}
                />
              </Text>
              <Text color={getStatusColor()} fontWeight="normal">
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
