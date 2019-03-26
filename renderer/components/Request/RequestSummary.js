import React from 'react'
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

class RequestSummary extends React.Component {
  state = {
    isExpired: null,
    timer: null,
  }

  static propTypes = {
    intl: intlShape.isRequired,
    /** Lnd invoice object for the payment request */
    invoice: PropTypes.object,
    /** Lightning Payment request. */
    payReq: PropTypes.string.isRequired,
    /** Show a notification. */
    showNotification: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { payReq } = this.props

    let decodedInvoice
    try {
      decodedInvoice = decodePayReq(payReq)
      const expiresIn = decodedInvoice.timeExpireDate * 1000 - Date.now()
      if (expiresIn >= 0) {
        this.setState({ isExpired: false })
        const timer = setInterval(() => this.setState({ isExpired: true }), expiresIn)
        this.setState({ timer })
      } else {
        this.setState({ isExpired: true })
      }
    } catch (e) {
      return null
    }
  }

  componentWillUnmount() {
    const { timer } = this.state
    clearInterval(timer)
  }

  render() {
    const { invoice = {}, payReq, intl, showNotification, ...rest } = this.props

    const copyToClipboard = data => {
      copy(data)
      const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
      showNotification(notifBody)
    }

    const { isExpired } = this.state
    let decodedInvoice
    try {
      decodedInvoice = decodePayReq(payReq)
    } catch (e) {
      return null
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
                css={{ 'word-wrap': 'break-word' }}
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
              <Text color={getStatusColor()} fontWeight="normal">
                <FormattedMessage {...messages.paid} />
                {` `}
                <FormattedTime value={invoice.settle_date * 1000} />
              </Text>
            ) : (
              <Text color={getStatusColor()} fontWeight="normal">
                {isExpired ? 'Expired ' : 'Expires '}
                <FormattedRelative
                  updateInterval={1000}
                  value={decodedInvoice.timeExpireDateString}
                />
                <br />
                <FormattedMessage {...messages.not_paid} />
              </Text>
            )
          }
        />
      </Box>
    )
  }
}

export default injectIntl(RequestSummary)
