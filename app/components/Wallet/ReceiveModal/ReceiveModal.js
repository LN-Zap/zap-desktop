import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import styled, { withTheme } from 'styled-components'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading, Message, Modal, QRCode, Tabs, Text } from 'components/UI'
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
    reveal: false
  }

  copyToClipboard = () => {
    const {
      pubkey,
      address,
      activeWalletSettings: { lndconnectQRCode },
      intl,
      showNotification
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
      reveal: !prevState.reveal
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
      isOpen,
      pubkey,
      address,
      closeReceiveModal,
      cryptoName,
      activeWalletSettings,
      networkInfo,
      intl
    } = this.props
    const { qrCodeType, reveal } = this.state

    if (!cryptoName) {
      return null
    }

    if (!isOpen) {
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
        name: <FormattedMessage {...messages.wallet_address} values={{ chain: cryptoName }} />
      }
    ]
    if (activeWalletSettings.lndconnectQRCode) {
      tabs.push({ key: QRCODE_TYPE_LNDCONNECT, name: <FormattedMessage {...messages.node_uri} /> })
    }

    return (
      <Modal onClose={closeReceiveModal}>
        <Box width={9 / 16} mx="auto">
          <Heading.h1 textAlign="center">
            <WalletName wallet={activeWalletSettings} />
            {networkInfo && networkInfo.id === 'testnet' && networkInfo.name}
          </Heading.h1>

          <Bar pt={2} />

          <Flex justifyContent="center" my={3}>
            <Tabs onClick={this.setQrcode} activeKey={qrCodeType} items={tabs} />
          </Flex>

          <Flex mt={4} mb={3} alignItems="center" flexDirection="column">
            {qrCode && qrCodeType !== QRCODE_TYPE_LNDCONNECT && (
              <QRCode value={qrCode} size="xlarge" />
            )}
            {qrCodeType === QRCODE_TYPE_LNDCONNECT && (
              <>
                <QRCode
                  value={qrCode}
                  size="xlarge"
                  obfuscate={qrCodeType === QRCODE_TYPE_LNDCONNECT && !reveal}
                />
                <Message variant="warning" justifyContent="center" my={3}>
                  <FormattedMessage {...messages.lndconnect_warning} />
                </Message>
                <Button size="small" onClick={this.toggleReveal}>
                  <FormattedMessage
                    {...messages[reveal ? 'lndconnect_hide_button' : 'lndconnect_reveal_button']}
                  />
                </Button>
              </>
            )}
          </Flex>

          <Flex bg="tertiaryColor" justifyContent="space-between">
            <ClippedText p={3} width={1} fontSize="s" textAlign="center">
              {qrCode}
            </ClippedText>
            <Button
              variant="secondary"
              py={0}
              px={0}
              onClick={this.copyToClipboard}
              className="hint--left"
              data-hint={message}
            >
              <Box bg="primaryColor" p={3} width={1}>
                <Copy />
              </Box>
            </Button>
          </Flex>
        </Box>
      </Modal>
    )
  }
}

ReceiveModal.propTypes = {
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  cryptoName: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  pubkey: PropTypes.string,
  address: PropTypes.string,
  activeWalletSettings: PropTypes.shape({
    lndconnectQRCode: PropTypes.string,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    host: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  closeReceiveModal: PropTypes.func.isRequired
}

export default withTheme(injectIntl(ReceiveModal))
