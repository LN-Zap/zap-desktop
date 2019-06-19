import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { Flex } from 'rebass'
import { Button, QRCode, Text } from 'components/UI'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import messages from './messages'

const Address = ({ address, intl, showNotification, ...rest }) => {
  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  return (
    <Flex alignItems="center" {...rest} flexDirection="column" justifyContent="center">
      <Text my={3}>
        <FormattedMessage {...messages.fund_title} />
      </Text>
      <QRCode mx="auto" size="small" value={address} />
      <Text my={3}>{address}</Text>
      <Button mx="auto" onClick={() => copyToClipboard(address)} size="small">
        <FormattedMessage {...messages.copy_address} />
      </Button>
    </Flex>
  )
}

Address.propTypes = {
  address: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(Address)
