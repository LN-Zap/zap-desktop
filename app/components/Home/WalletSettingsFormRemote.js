import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box } from 'rebass'
import { Bar, DataRow, Input, Text, OpenDialogInput, RowLabel } from 'components/UI'

import messages from './messages'

const WalletSettingsFormRemote = ({
  intl,
  wallet,
  host,
  cert,
  macaroon,
  showConnectionSettings
}) => {
  return (
    <>
      <Box mb={4} as="section">
        <Text fontWeight="normal">
          <FormattedMessage {...messages.section_basic_title} />
        </Text>
        <Bar mt={2} mb={4} />

        <DataRow py={2} left={<FormattedMessage {...messages.chain} />} right={wallet.chain} />
        <DataRow py={2} left={<FormattedMessage {...messages.network} />} right={wallet.network} />
      </Box>
      {showConnectionSettings && (
        <Box mb={4} as="section">
          <Text fontWeight="normal">
            <FormattedMessage {...messages.section_connection_details} />
          </Text>
          <Bar mt={2} mb={4} />
          <DataRow
            py={2}
            left={
              <RowLabel
                htmlFor="host"
                nameMessage={messages.hostname_title}
                descMessage={messages.hostname_description}
              />
            }
            right={
              <Input
                field="host"
                id="host"
                placeholder={intl.formatMessage({
                  ...messages.hostname_title
                })}
                width={300}
                ml="auto"
                initialValue={host}
                justifyContent="right"
                css={{ 'text-align': 'right' }}
              />
            }
          />
          <DataRow
            py={2}
            left={
              <RowLabel
                htmlFor="cert"
                nameMessage={messages.cert_title}
                descMessage={messages.cert_description}
              />
            }
            right={<OpenDialogInput field="cert" name="cert" initialValue={cert} width={300} />}
          />
          <DataRow
            py={2}
            left={
              <RowLabel
                htmlFor="macaroon"
                nameMessage={messages.macaroon_title}
                descMessage={messages.macaroon_description}
              />
            }
            right={
              <OpenDialogInput
                field="macaroon"
                name="macaroon"
                initialValue={macaroon}
                width={300}
              />
            }
          />
        </Box>
      )}
      <Box mb={4} as="section">
        <Text fontWeight="normal">
          <FormattedMessage {...messages.section_naming_title} />
        </Text>
        <Bar mt={2} mb={4} />

        <DataRow
          py={2}
          left={
            <RowLabel
              htmlFor="name"
              nameMessage={messages.wallet_settings_name_label}
              descMessage={messages.wallet_settings_name_description}
            />
          }
          right={
            <Input
              field="name"
              id="name"
              placeholder={intl.formatMessage({
                ...messages.wallet_settings_name_placeholder
              })}
              width={300}
              ml="auto"
              justifyContent="right"
              css={{ 'text-align': 'right' }}
            />
          }
        />
      </Box>
    </>
  )
}

WalletSettingsFormRemote.propTypes = {
  intl: intlShape.isRequired,
  wallet: PropTypes.object.isRequired,
  host: PropTypes.string.isRequired,
  cert: PropTypes.string.isRequired,
  macaroon: PropTypes.string.isRequired,
  showConnectionSettings: PropTypes.bool.isRequired
}

export default injectIntl(WalletSettingsFormRemote)
