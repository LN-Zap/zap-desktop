import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { CopyBox, Bar, Header, QRCode } from 'components/UI'
import { WalletName } from 'components/Util'

import messages from './messages'

const ReceiveModal = ({
  currentAddress,
  cryptoAddressName,
  activeWalletSettings,
  networkInfo,
  showNotification,
  intl,
  ...rest
}) => {
  const notifyOfCopy = () =>
    showNotification(intl.formatMessage({ ...messages.address_copied_notification_description }))

  return (
    <Box {...rest}>
      <Header
        subtitle={
          <FormattedMessage {...messages.receive_subtitle} values={{ cryptoAddressName }} />
        }
        title={
          <>
            <WalletName wallet={activeWalletSettings} />
            {networkInfo && networkInfo.id !== 'mainnet' && ` (${networkInfo.name})`}
          </>
        }
      />
      <Bar mt={2} />

      {currentAddress && (
        <Flex alignItems="center" flexDirection="column" mb={3} mt={4}>
          <QRCode size="xxlarge" value={currentAddress} />
        </Flex>
      )}

      <CopyBox
        hint={intl.formatMessage({ ...messages.copy_address })}
        my={3}
        onCopy={notifyOfCopy}
        value={currentAddress}
      />
    </Box>
  )
}

ReceiveModal.propTypes = {
  activeWalletSettings: PropTypes.shape({
    host: PropTypes.string,
    id: PropTypes.number.isRequired,
    lndconnectQRCode: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
  cryptoAddressName: PropTypes.string,
  currentAddress: PropTypes.string,
  intl: intlShape.isRequired,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(ReceiveModal)
