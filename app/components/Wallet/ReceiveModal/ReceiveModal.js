import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { withTheme } from 'styled-components'
import { FormattedMessage, injectIntl } from 'react-intl'
import { showNotification } from 'lib/utils/notifications'
import { Box, Flex } from 'rebass'
import { Button, Heading, Modal, QRCode, Text } from 'components/UI'
import Copy from 'components/Icon/Copy'
import messages from './messages'

const QRCODE_TYPE_ADDRESS = 'address'
const QRCODE_TYPE_PUBKEY = 'pubkey'

class ReceiveModal extends React.Component {
  state = {
    qrCodeType: QRCODE_TYPE_ADDRESS
  }

  copyPubkeyToClipboard = () => {
    const { pubkey, intl } = this.props
    copy(pubkey)
    const notifTitle = intl.formatMessage({ ...messages.pubkey_copied_notification_title })
    const notifBody = intl.formatMessage({ ...messages.pubkey_copied_notification_description })
    showNotification(notifTitle, notifBody)
  }

  copyAddressToClipboard = () => {
    const { address, intl } = this.props
    copy(address)
    const notifTitle = intl.formatMessage({ ...messages.address_copied_notification_title })
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifTitle, notifBody)
  }

  setQrcode = type => {
    this.setState({ qrCodeType: type })
  }

  render() {
    const {
      isOpen,
      pubkey,
      address,
      alias,
      closeReceiveModal,
      cryptoName,
      network,
      intl
    } = this.props
    const { qrCodeType } = this.state

    if (!cryptoName) {
      return null
    }

    if (!isOpen) {
      return null
    }

    let qrCode
    switch (qrCodeType) {
      case QRCODE_TYPE_ADDRESS:
        qrCode = address
        break
      case QRCODE_TYPE_PUBKEY:
        qrCode = pubkey
        break
    }

    return (
      <Modal onClose={closeReceiveModal}>
        <Flex justifyContent="center" alignItems="center" css={{ height: '100%' }}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            width={1}
            bg="secondaryColor"
            p={4}
          >
            <Flex as="section" flexDirection="column" alignItems="center" width={1 / 3}>
              <Heading.h3 textAlign="center">
                {alias && alias.length ? alias : pubkey.substring(0, 10)}
              </Heading.h3>
              <Flex justifyContent="center" mb={3}>
                <Button
                  active={qrCode === pubkey}
                  variant="secondary"
                  size="small"
                  onClick={() => this.setQrcode(QRCODE_TYPE_PUBKEY)}
                  mr={2}
                >
                  <FormattedMessage {...messages.node_pubkey} />
                </Button>
                <Button
                  active={qrCode === address}
                  variant="secondary"
                  size="small"
                  onClick={() => this.setQrcode(QRCODE_TYPE_ADDRESS)}
                  ml={2}
                >
                  <FormattedMessage {...messages.wallet_address} values={{ chain: cryptoName }} />
                </Button>
              </Flex>
              {qrCode && <QRCode value={qrCode} size="small" />}
            </Flex>

            <Box as="section" width={2 / 3}>
              <Box mb={4}>
                <Heading.h4 mb={2} fontWeight="normal">
                  <FormattedMessage {...messages.node_public_key} />
                </Heading.h4>
                <Flex bg="tertiaryColor" justifyContent="space-between" width={1}>
                  <Text
                    p={3}
                    fontSize="s"
                    css={{
                      overflow: 'hidden',
                      'white=space': 'nowrap',
                      'text-overflow': 'ellipsis'
                    }}
                  >
                    {pubkey}
                  </Text>
                  <Button
                    variant="secondary"
                    py={0}
                    px={0}
                    onClick={this.copyPubkeyToClipboard}
                    className="hint--left"
                    data-hint={intl.formatMessage({ ...messages.copy_pubkey })}
                  >
                    <Box bg="primaryColor" p={3}>
                      <Copy />
                    </Box>
                  </Button>
                </Flex>
              </Box>

              <Box>
                <Heading.h4 mb={2} fontWeight="normal">
                  <FormattedMessage {...messages.wallet_address} values={{ chain: cryptoName }} />{' '}
                  {network && network.name.toLowerCase() === 'testnet' && network.name}
                </Heading.h4>
                <Flex bg="tertiaryColor" justifyContent="space-between" width={1}>
                  <Text
                    p={3}
                    fontSize="s"
                    css={{
                      overflow: 'hidden',
                      'white=space': 'nowrap',
                      'text-overflow': 'ellipsis'
                    }}
                  >
                    {address}
                  </Text>
                  <Button
                    variant="secondary"
                    py={0}
                    px={0}
                    onClick={this.copyAddressToClipboard}
                    className="hint--left"
                    data-hint={intl.formatMessage({ ...messages.copy_address })}
                  >
                    <Box bg="primaryColor" p={3}>
                      <Copy />
                    </Box>
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Modal>
    )
  }
}

ReceiveModal.propTypes = {
  network: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  cryptoName: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  pubkey: PropTypes.string,
  address: PropTypes.string,
  alias: PropTypes.string,
  closeReceiveModal: PropTypes.func.isRequired
}

export default withTheme(injectIntl(ReceiveModal))
