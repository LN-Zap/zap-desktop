import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage, FormattedRelative, FormattedTime, injectIntl } from 'react-intl'
import { decodePayReq } from 'lib/utils/crypto'
import copy from 'copy-to-clipboard'
import { Bar, DataRow, Button, QRCode, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

class RequestSummary extends React.Component {
  state = {
    isExpired: null,
    timer: null
  }

  static propTypes = {
    /** Lnd invoice object for the payment request */
    invoice: PropTypes.object,
    /** Lightning Payment request. */
    payReq: PropTypes.string.isRequired,
    /** Show a notification. */
    showNotification: PropTypes.func.isRequired
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

    return (
      <Box {...rest}>
        <DataRow
          left={<FormattedMessage {...messages.amount} />}
          right={
            <Flex alignItems="center">
              <CryptoSelector mr={2} />
              <CryptoValue value={satoshis} fontSize="xxl" />
            </Flex>
          }
        />

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.current_value} />}
          right={
            <Flex alignItems="center">
              <FiatSelector mr={2} />
              <FiatValue value={satoshis} />
            </Flex>
          }
        />

        <Bar />

        {memo && (
          <>
            <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />
            <Bar />
          </>
        )}

        <DataRow
          left={
            <React.Fragment>
              <FormattedMessage {...messages.payment_request} />
              <Text
                fontSize="xs"
                fontWeight="light"
                mb={2}
                css={{ 'word-wrap': 'break-word' }}
                className="hint--bottom-left"
                data-hint={payReq}
              >
                <Truncate text={payReq} maxlen={40} />
              </Text>
              <Button type="button" size="small" onClick={() => copyToClipboard(payReq)}>
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

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.status} />}
          right={
            invoice.settled ? (
              <Text color="superGreen" fontWeight="normal">
                <FormattedMessage {...messages.paid} />
                {` `}
                <FormattedTime value={invoice.settle_date * 1000} />
              </Text>
            ) : (
              <Text color="superRed" fontWeight="normal">
                {isExpired ? 'Expired ' : 'Expires '}
                <FormattedRelative
                  value={decodedInvoice.timeExpireDateString}
                  updateInterval={1000}
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
