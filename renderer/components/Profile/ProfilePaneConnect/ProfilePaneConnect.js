import React, { useState } from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Bar, DataRow, Button, CopyBox, Message, QRCode, Text } from 'components/UI'

import messages from './messages'

const ProfilePaneConnect = ({ intl, lndconnectQRCode, showNotification, ...rest }) => {
  const [isObfuscated, setIsObfuscated] = useState(true)
  const toggleReveal = () => setIsObfuscated(!isObfuscated)
  const buttonMessage = isObfuscated ? 'lndconnect_reveal_button' : 'lndconnect_hide_button'
  const notifyOfCopy = () =>
    showNotification(intl.formatMessage({ ...messages.lndconnect_copied_notification_description }))

  return (
    <Box as="section" {...rest}>
      <Text fontWeight="normal">
        <FormattedMessage {...messages.connect_pane_title} />
      </Text>
      <Bar mb={4} mt={2} />
      {lndconnectQRCode && (
        <>
          <DataRow
            left={
              <Box pr={4}>
                <Text fontWeight="normal" mb={2}>
                  <FormattedMessage {...messages.lndconnect_title} />
                </Text>
                <Text color="gray" fontWeight="light">
                  <FormattedMessage {...messages.lndconnect_description} />
                </Text>
                <Button mt={4} onClick={toggleReveal} size="small">
                  <FormattedMessage {...messages[buttonMessage]} />
                </Button>
                <Message my={3} variant="warning">
                  <FormattedMessage {...messages.lndconnect_warning} />
                </Message>
              </Box>
            }
            py={2}
            right={<QRCode isObfuscated={isObfuscated} size="xxlarge" value={lndconnectQRCode} />}
          />

          <CopyBox
            hint={intl.formatMessage({ ...messages.copy_lndconnect })}
            my={3}
            onCopy={notifyOfCopy}
            value={lndconnectQRCode}
          />
        </>
      )}
    </Box>
  )
}

ProfilePaneConnect.propTypes = {
  intl: intlShape.isRequired,
  lndconnectQRCode: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(ProfilePaneConnect)
