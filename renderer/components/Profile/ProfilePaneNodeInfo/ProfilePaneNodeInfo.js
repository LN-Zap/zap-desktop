import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { clean } from 'semver'
import { Box } from 'rebass'
import { Bar, CopyBox, DataRow, QRCode, Text } from 'components/UI'
import messages from './messages'
import { intlShape } from '@zap/i18n'
/**
 * backupMethodMessageMapper - Returns intl message for the specified provider.
 *
 * @param {string} provider Provider
 * @param {intlShape} intl Intl
 * @returns {string} Intl message
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
  commitString,
  nodeUriOrPubkey,
  showNotification,
  backupProvider,
  versionString,
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
        right={
          <>
            <Text>{versionString}</Text>
            {commitString && clean(commitString) !== versionString && (
              <Text color="grey" fontSize="s">
                {commitString}
              </Text>
            )}
          </>
        }
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
  commitString: PropTypes.string,
  intl: intlShape.isRequired,
  nodeUriOrPubkey: PropTypes.string.isRequired,
  showNotification: PropTypes.func.isRequired,
  versionString: PropTypes.string.isRequired,
}

export default injectIntl(ProfilePaneNodeInfo)
