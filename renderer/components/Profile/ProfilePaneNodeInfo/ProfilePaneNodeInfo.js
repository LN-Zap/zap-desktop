import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box } from 'rebass'
import { Bar, CopyBox, DataRow, QRCode, Text } from 'components/UI'
import messages from './messages'

/**
 * backupMethodMessageMapper - Returns intl message for the specified provider.
 *
 * @param {string} provider
 * @param {intlShape} intl
 * @returns
 */
function backupMethodMessageMapper(provider, intl) {
  const MAP = {
    gdrive: messages.backup_method_gdrive,
    dropbox: messages.backup_method_dropbox,
    local: messages.backup_method_local,
  }
  const intlMsg = MAP[provider]
  return intlMsg && intl.formatMessage({ ...intlMsg })
}

const ProfilePaneNodeInfo = ({
  intl,
  activeWalletSettings,
  nodeUriOrPubkey,
  lndVersion,
  showNotification,
  backupProvider,
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
      {backupProvider && (
        <DataRow
          left={
            <Text fontWeight="normal">
              <FormattedMessage {...messages.backup_method} />
            </Text>
          }
          py={2}
          right={backupMethodMessageMapper(backupProvider, intl)}
        />
      )}
    </Box>
  )
}

ProfilePaneNodeInfo.propTypes = {
  activeWalletSettings: PropTypes.object.isRequired,
  backupProvider: PropTypes.string,
  intl: intlShape.isRequired,
  lndVersion: PropTypes.string,
  nodeUriOrPubkey: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default injectIntl(ProfilePaneNodeInfo)
