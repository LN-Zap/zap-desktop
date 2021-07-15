import React from 'react'

import copy from 'copy-to-clipboard'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Button, QRCode, Spinner, Text } from 'components/UI'

import messages from './messages'

const Address = ({ address, isAddressLoading, intl, showNotification, ...rest }) => {
  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  const renderLoading = () => {
    return (
      <>
        <Spinner />
        <Text>
          <FormattedMessage {...messages.generating_address} />
        </Text>
      </>
    )
  }

  const renderAddress = () => (
    <>
      <Text my={3}>
        <FormattedMessage {...messages.fund_title} />
      </Text>
      <QRCode mx="auto" size="small" value={address} />
      <Text my={3}>{address}</Text>
      <Button mx="auto" onClick={() => copyToClipboard(address)} size="small">
        <FormattedMessage {...messages.copy_address} />
      </Button>
    </>
  )

  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center" {...rest}>
      {isAddressLoading && renderLoading()}
      {!isAddressLoading && address && renderAddress()}
    </Flex>
  )
}

Address.propTypes = {
  address: PropTypes.string,
  intl: intlShape.isRequired,
  isAddressLoading: PropTypes.bool,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(Address)
