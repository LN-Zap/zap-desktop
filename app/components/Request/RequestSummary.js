import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage, FormattedRelative, injectIntl } from 'react-intl'
import { decodePayReq } from 'lib/utils/crypto'
import { showNotification } from 'lib/utils/notifications'
import copy from 'copy-to-clipboard'
import { Bar, DataRow, Button, Dropdown, QRCode, Text, Value } from 'components/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

class RequestSummary extends React.Component {
  state = {
    isExpired: null,
    timer: null
  }

  static propTypes = {
    /** Currently selected cryptocurrency (key). */
    cryptoCurrency: PropTypes.string.isRequired,
    /** List of supported cryptocurrencies. */
    cryptoCurrencies: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    /** Boolean indicating wether the invoice has already been paid. */
    isPaid: PropTypes.bool,
    /** Lightning Payment request. */
    payReq: PropTypes.string.isRequired,
    /** Set the current cryptocurrency. */
    setCryptoCurrency: PropTypes.func.isRequired
  }

  static defaultProps = {
    isPaid: false
  }

  componentDidMount() {
    const { payReq } = this.props

    let invoice
    try {
      invoice = decodePayReq(payReq)
      const expiresIn = invoice.timeExpireDate * 1000 - Date.now()
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

  copyPaymentRequest = () => {
    const { intl, payReq } = this.props
    copy(payReq)
    showNotification(
      intl.formatMessage({ ...messages.address_notification_title }),
      intl.formatMessage({ ...messages.copied_notification_description })
    )
  }

  render() {
    const {
      cryptoCurrency,
      cryptoCurrencies,
      isPaid,
      payReq,
      setCryptoCurrency,
      ...rest
    } = this.props
    const { isExpired } = this.state
    let invoice
    try {
      invoice = decodePayReq(payReq)
    } catch (e) {
      return null
    }

    const { satoshis } = invoice
    const descriptionTag = invoice.tags.find(tag => tag.tagName === 'description') || {}
    const memo = descriptionTag.data

    return (
      <Box {...rest}>
        {memo && (
          <React.Fragment>
            <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} /> <Bar />{' '}
          </React.Fragment>
        )}

        <DataRow
          left={<FormattedMessage {...messages.amount} />}
          right={
            <Flex alignItems="center" justifyContent="flex-end">
              <Value value={satoshis} currency={cryptoCurrency} />
              <Dropdown
                activeKey={cryptoCurrency}
                items={cryptoCurrencies}
                onChange={setCryptoCurrency}
                justify="right"
                ml={2}
              />
            </Flex>
          }
        />

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.qrcode} />}
          right={
            <Text>
              <QRCode value={payReq} size="125px" />
            </Text>
          }
        />

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.ln_invoice} />}
          right=<React.Fragment>
            <Text
              fontSize="xs"
              fontWeight="normal"
              mb={2}
              css={{ 'word-wrap': 'break-word' }}
              className="hint--bottom-left"
              data-hint={payReq}
            >
              <Truncate text={payReq} maxlen={40} />
            </Text>
            <Button type="button" size="small" onClick={this.copyPaymentRequest}>
              <FormattedMessage {...messages.copy_button_text} />
            </Button>
          </React.Fragment>
        />

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.status} />}
          right={
            <React.Fragment>
              <Text color={isPaid || !isExpired ? 'superGreen' : 'superRed'} fontWeight="normal">
                {isExpired ? 'Expired ' : 'Expires '}
                <FormattedRelative value={invoice.timeExpireDateString} updateInterval={1000} />
              </Text>
              <Text
                color={isPaid ? 'superGreen' : isExpired ? 'superRed' : 'grey'}
                fontWeight="normal"
              >
                {isPaid ? (
                  <FormattedMessage {...messages.paid} />
                ) : (
                  <FormattedMessage {...messages.not_paid} />
                )}
              </Text>
            </React.Fragment>
          }
        />
      </Box>
    )
  }
}

export default injectIntl(RequestSummary)
