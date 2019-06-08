import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box } from 'rebass'
import { Bar, CopyBox, DataRow, QRCode, Text } from 'components/UI'
import messages from './messages'

const ProfilePaneNodeInfo = ({
  intl,
  activeWalletSettings,
  nodeUriOrPubkey,
  lndVersion,
  showNotification,
  ...rest
}) => {
  const notifyOfCopy = () =>
    showNotification(intl.formatMessage({ ...messages.pubkey_copied_notification_description }))
  const isLocalWallet = activeWalletSettings.type === 'local'

  return (
    <Box as="section" {...rest}>
      <Text fontWeight="normal">
        <FormattedMessage {...messages.nodeinfo_pane_title} />
      </Text>
      <Bar mb={4} mt={2} />
      {nodeUriOrPubkey && (
        <>
          <DataRow
            left={
              <>
                <Text fontWeight="normal" mb={2}>
                  <FormattedMessage {...messages.node_pubkey_title} />
                </Text>
                <Text color="gray" fontWeight="light">
                  <FormattedMessage {...messages.node_pubkey_description} />
                </Text>
              </>
            }
            py={2}
            right={!isLocalWallet && <QRCode size="xxlarge" value={nodeUriOrPubkey} />}
          />
          <CopyBox
            hint={intl.formatMessage({ ...messages.copy_pubkey })}
            my={3}
            onCopy={notifyOfCopy}
            value={nodeUriOrPubkey}
          />
        </>
      )}
      <DataRow
        left={
          <Text fontWeight="normal">
            <FormattedMessage {...messages.node_version} />
          </Text>
        }
        py={2}
        right={lndVersion}
      />
    </Box>
  )
}

ProfilePaneNodeInfo.propTypes = {
  activeWalletSettings: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  lndVersion: PropTypes.string,
  nodeUriOrPubkey: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(ProfilePaneNodeInfo)
