import React from 'react'
import PropTypes from 'prop-types'

import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box } from 'rebass'
import {
  Bar,
  DataRow,
  Input,
  Text,
  OpenDialogInput,
  RowLabel,
  LndConnectionStringEditor,
} from 'components/UI'

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
                  nameMessage={messages.hostname_title}
                />
              }
              py={2}
              right={
                <Input
                  css={{ 'text-align': 'right' }}
                  field="host"
                  id="host"
                  initialValue={host}
                  justifyContent="right"
                  ml="auto"
                  placeholder={intl.formatMessage({
                    ...messages.hostname_title,
                  })}
                  width={300}
                />
              }
            />
            <DataRow
              left={
                <RowLabel
                  descMessage={messages.cert_description}
                  htmlFor="cert"
                  nameMessage={messages.cert_title}
                />
              }
              py={2}
              right={<OpenDialogInput field="cert" initialValue={cert} name="cert" width={300} />}
            />
            <DataRow
              left={
                <RowLabel
                  descMessage={messages.macaroon_description}
                  htmlFor="macaroon"
                  nameMessage={messages.macaroon_title}
                />
              }
              py={2}
              right={
                <OpenDialogInput
                  field="macaroon"
                  initialValue={macaroon}
                  name="macaroon"
                  width={300}
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
              nameMessage={messages.wallet_settings_name_label}
            />
          }
          py={2}
          right={
            <Input
              css={{ 'text-align': 'right' }}
              field="name"
              id="name"
              justifyContent="right"
              ml="auto"
              placeholder={intl.formatMessage({
                ...messages.wallet_settings_name_placeholder,
              })}
              width={300}
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
