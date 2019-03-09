import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import styled, { withTheme } from 'styled-components'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading, Message, QRCode, Tabs, Text } from 'components/UI'
import { WalletName } from 'components/Util'
import Copy from 'components/Icon/Copy'
import messages from './messages'

const QRCODE_TYPE_ADDRESS = 'address'
const QRCODE_TYPE_PUBKEY = 'pubkey'
const QRCODE_TYPE_LNDCONNECT = 'lndconnect'

const ClippedText = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

class ReceiveModal extends React.PureComponent {
  state = {
    qrCodeType: QRCODE_TYPE_ADDRESS,
    reveal: false,
  }

  copyToClipboard = () => {
    const {
      pubkey,
      address,
      activeWalletSettings: { lndconnectQRCode },
      intl,
      showNotification,
    } = this.props
    const { qrCodeType } = this.state

    let qrCode, notifBody
    switch (qrCodeType) {
      case QRCODE_TYPE_ADDRESS:
        qrCode = address
        notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
        break
      case QRCODE_TYPE_PUBKEY:
        qrCode = pubkey
        notifBody = intl.formatMessage({ ...messages.pubkey_copied_notification_description })
        break
      case QRCODE_TYPE_LNDCONNECT:
        qrCode = lndconnectQRCode
        notifBody = intl.formatMessage({ ...messages.lndconnect_copied_notification_description })
        break
    }

    copy(qrCode)
    showNotification(notifBody)
  }

  toggleReveal = () => {
    this.setState(prevState => ({
      reveal: !prevState.reveal,
    }))
  }

  setReveal = reveal => {
    this.setState({ reveal })
  }

  setQrcode = type => {
    this.setState({ qrCodeType: type })
    this.setReveal(false)
  }

  render() {
    const {
      pubkey,
      address,
      cryptoName,
      activeWalletSettings,
      networkInfo,
      intl,
      ...rest
    } = this.props
    const { qrCodeType, reveal } = this.state

    if (!cryptoName) {
      return null
    }

    let qrCode, message

    switch (qrCodeType) {
      case QRCODE_TYPE_ADDRESS:
        qrCode = address
        message = intl.formatMessage({ ...messages.copy_address })
        break
      case QRCODE_TYPE_PUBKEY:
        qrCode = pubkey
        message = intl.formatMessage({ ...messages.copy_pubkey })
        break
      case QRCODE_TYPE_LNDCONNECT:
        qrCode = activeWalletSettings.lndconnectQRCode
        message = intl.formatMessage({ ...messages.copy_uri })
        break
      default:
        message = intl.formatMessage({ ...messages.copy })
        break
    }

    const tabs = [
      { key: QRCODE_TYPE_PUBKEY, name: <FormattedMessage {...messages.node_pubkey} /> },
      {
        key: QRCODE_TYPE_ADDRESS,
        name: <FormattedMessage {...messages.wallet_address} values={{ chain: cryptoName }} />,
      },
    ]
    if (activeWalletSettings.lndconnectQRCode) {
      tabs.push({ key: QRCODE_TYPE_LNDCONNECT, name: <FormattedMessage {...messages.node_uri} /> })
    }

    return (
      <Box {...rest}>
        <Heading.h1 textAlign="center">
          <WalletName wallet={activeWalletSettings} />
          {networkInfo && networkInfo.id === 'testnet' && networkInfo.name}
        </Heading.h1>

        <Bar mt={2} />

        <Flex justifyContent="center" my={3}>
          <Tabs activeKey={qrCodeType} items={tabs} onClick={this.setQrcode} />
        </Flex>

        <Flex alignItems="center" flexDirection="column" mb={3} mt={4}>
          {qrCode && qrCodeType !== QRCODE_TYPE_LNDCONNECT && (
            <QRCode size="xlarge" value={qrCode} />
          )}
          {qrCodeType === QRCODE_TYPE_LNDCONNECT && (
            <>
              <QRCode
                isObfuscated={qrCodeType === QRCODE_TYPE_LNDCONNECT && !reveal}
                size="xlarge"
                value={qrCode}
              />
              <Message justifyContent="center" my={3} variant="warning">
                <FormattedMessage {...messages.lndconnect_warning} />
              </Message>
              <Button onClick={this.toggleReveal} size="small">
                <FormattedMessage
                  {...messages[reveal ? 'lndconnect_hide_button' : 'lndconnect_reveal_button']}
                />
              </Button>
            </>
          )}
        </Flex>

        <Flex bg="tertiaryColor" justifyContent="space-between">
          <ClippedText fontSize="s" p={3} textAlign="center" width={1}>
            {qrCode}
          </ClippedText>
          <Button
            className="hint--left"
            data-hint={message}
            onClick={this.copyToClipboard}
            px={0}
            py={0}
            variant="secondary"
          >
            <Box bg="primaryColor" p={3} width={1}>
              <Copy />
            </Box>
          </Button>
        </Flex>
      </Box>
    )
  }
}

ReceiveModal.propTypes = {
  activeWalletSettings: PropTypes.shape({
    host: PropTypes.string,
    id: PropTypes.number.isRequired,
    lndconnectQRCode: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
  address: PropTypes.string,
  cryptoName: PropTypes.string,
  intl: intlShape.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  pubkey: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
}

export default withTheme(injectIntl(ReceiveModal))
