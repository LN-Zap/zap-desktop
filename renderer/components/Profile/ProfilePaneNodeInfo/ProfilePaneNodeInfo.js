import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import { clean } from 'semver'

import { intlShape } from '@zap/i18n'
import { Bar, CopyBox, DataRow, QRCode, Text } from 'components/UI'

import messages from './messages'

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
  nodeUrisOrPubkey,
  showNotification,
  backupProvider,
  versionString,
  ...rest
}) => {
  const notifyOfCopy = () =>
    showNotification(intl.formatMessage({ ...messages.pubkey_copied_notification_description }))
  const isLocalWallet = activeWalletSettings.type === 'local'

  const renderMultipleNodeUris = () => (
    <>
      <Box mb={4}>
        <Text fontWeight="normal" mb={2}>
          <FormattedMessage {...messages.node_pubkey_title} />
        </Text>
        <Text color="gray" fontWeight="light">
          <FormattedMessage {...messages.node_pubkey_description} />
        </Text>
      </Box>
      {nodeUrisOrPubkey.map(uriOrPubkey => (
        <Box key={uriOrPubkey} mb={6}>
          {!isLocalWallet && (
            <Flex justifyContent="center">
              <QRCode size="xxlarge" value={uriOrPubkey} />
            </Flex>
          )}
          <CopyBox
            hint={intl.formatMessage({ ...messages.copy_pubkey })}
            my={3}
            onCopy={notifyOfCopy}
            value={uriOrPubkey}
          />
        </Box>
      ))}
    </>
  )

  const renderSingleNodeUri = () => (
    <>
      <DataRow
        left={
          <Box mr={3}>
            <Text fontWeight="normal" mb={2}>
              <FormattedMessage {...messages.node_pubkey_title} />
            </Text>
            <Text color="gray" fontWeight="light">
              <FormattedMessage {...messages.node_pubkey_description} />
            </Text>
          </Box>
        }
        py={2}
        right={!isLocalWallet && <QRCode size="xxlarge" value={nodeUrisOrPubkey[0]} />}
      />
      <CopyBox
        hint={intl.formatMessage({ ...messages.copy_pubkey })}
        my={3}
        onCopy={notifyOfCopy}
        value={nodeUrisOrPubkey[0]}
      />
    </>
  )

  return (
    <Box as="section" {...rest}>
      <Text fontWeight="normal">
        <FormattedMessage {...messages.nodeinfo_pane_title} />
      </Text>
      <Bar mb={4} mt={2} />
      {nodeUrisOrPubkey && nodeUrisOrPubkey.length > 0 && nodeUrisOrPubkey.length > 1
        ? renderMultipleNodeUris()
        : renderSingleNodeUri()}
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
  nodeUrisOrPubkey: PropTypes.arrayOf(PropTypes.string).isRequired,
  showNotification: PropTypes.func.isRequired,
  versionString: PropTypes.string.isRequired,
}

export default injectIntl(ProfilePaneNodeInfo)
