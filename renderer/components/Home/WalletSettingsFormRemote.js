import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass/styled-components'

import { intlShape } from '@zap/i18n'
import { Input, OpenDialogInput, RowLabel, LndConnectionStringEditor } from 'components/Form'
import { Bar, DataRow, Text } from 'components/UI'

import messages from './messages'

const WalletSettingsFormRemote = ({
  intl,
  wallet,
  host,
  cert,
  macaroon,
  isEmbeddedConnectionString,
}) => {
  return (
    <>
      <Box as="section" mb={4}>
        <Text fontWeight="normal">
          <FormattedMessage {...messages.section_basic_title} />
        </Text>
        <Bar mb={4} mt={2} />

        <DataRow left={<FormattedMessage {...messages.chain} />} py={2} right={wallet.chain} />
        <DataRow left={<FormattedMessage {...messages.network} />} py={2} right={wallet.network} />
      </Box>
      <Box as="section" mb={4}>
        <Text fontWeight="normal">
          <FormattedMessage {...messages.section_connection_details} />
        </Text>
        <Bar mb={4} mt={2} />

        {isEmbeddedConnectionString ? (
          <LndConnectionStringEditor
            field="lndconnectUri"
            hideStringMessage={<FormattedMessage {...messages.hide_connection_string} />}
            isRequired
            label={intl.formatMessage({
              ...messages.connection_string,
            })}
            name="lndconnectUri"
            placeholder={intl.formatMessage({
              ...messages.connection_string,
            })}
            validateOnBlur
            validateOnChange
          />
        ) : (
          <>
            <DataRow
              left={
                <RowLabel
                  descMessage={messages.hostname_description}
                  htmlFor="host"
                  mr={2}
                  nameMessage={messages.hostname_title}
                />
              }
              py={2}
              right={
                <Input
                  field="host"
                  id="host"
                  initialValue={host}
                  isRequired
                  justifyContent="flex-end"
                  ml="auto"
                  placeholder={intl.formatMessage({
                    ...messages.hostname_title,
                  })}
                  textAlign="right"
                  width={250}
                />
              }
            />
            <DataRow
              left={
                <RowLabel
                  descMessage={messages.cert_description}
                  htmlFor="cert"
                  mr={2}
                  nameMessage={messages.cert_title}
                />
              }
              py={2}
              right={<OpenDialogInput field="cert" initialValue={cert} name="cert" width={250} />}
            />
            <DataRow
              left={
                <RowLabel
                  descMessage={messages.macaroon_description}
                  htmlFor="macaroon"
                  mr={2}
                  nameMessage={messages.macaroon_title}
                />
              }
              py={2}
              right={
                <OpenDialogInput
                  field="macaroon"
                  initialValue={macaroon}
                  name="macaroon"
                  width={250}
                />
              }
            />
          </>
        )}
      </Box>
      <Box as="section" mb={4}>
        <Text fontWeight="normal">
          <FormattedMessage {...messages.section_naming_title} />
        </Text>
        <Bar mb={4} mt={2} />

        <DataRow
          left={
            <RowLabel
              descMessage={messages.wallet_settings_name_description}
              htmlFor="name"
              mr={2}
              nameMessage={messages.wallet_settings_name_label}
            />
          }
          py={2}
          right={
            <Input
              allowEmptyString
              field="name"
              id="name"
              justifyContent="flex-end"
              maxLength={30}
              ml="auto"
              placeholder={intl.formatMessage({
                ...messages.wallet_settings_name_placeholder,
              })}
              textAlign="right"
              width={250}
            />
          }
        />
      </Box>
    </>
  )
}

WalletSettingsFormRemote.propTypes = {
  cert: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  isEmbeddedConnectionString: PropTypes.bool.isRequired,
  macaroon: PropTypes.string.isRequired,
  wallet: PropTypes.object.isRequired,
}

export default injectIntl(WalletSettingsFormRemote)
