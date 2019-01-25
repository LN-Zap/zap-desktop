import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass'
import { Bar, DataRow, Input, Label, Text } from 'components/UI'
import messages from './messages'

const WalletSettingsFormRemote = ({ intl, wallet }) => (
  <>
    <Box mb={4} as="section">
      <Text fontWeight="normal">
        <FormattedMessage {...messages.section_basic_title} />
      </Text>
      <Bar mt={2} mb={4} />

      <DataRow py={2} left={<FormattedMessage {...messages.chain} />} right={wallet.chain} />
      <DataRow py={2} left={<FormattedMessage {...messages.network} />} right={wallet.network} />
      <DataRow py={2} left={<FormattedMessage {...messages.host} />} right={wallet.host} />
    </Box>

    <Box mb={4} as="section">
      <Text fontWeight="normal">
        <FormattedMessage {...messages.section_naming_title} />
      </Text>
      <Bar mt={2} mb={4} />

      <DataRow
        py={2}
        left={
          <>
            <Label htmlFor="name" mb={2}>
              <FormattedMessage {...messages.wallet_settings_name_label} />
            </Label>
            <Text color="gray" fontWeight="light">
              <FormattedMessage {...messages.wallet_settings_name_description} />
            </Text>
          </>
        }
        right={
          <Input
            field="name"
            id="name"
            placeholder={intl.formatMessage({
              ...messages.wallet_settings_name_placeholder
            })}
            width={1}
            ml="auto"
            justifyContent="right"
            css={{ 'text-align': 'right' }}
          />
        }
      />
    </Box>
  </>
)

WalletSettingsFormRemote.propTypes = {
  wallet: PropTypes.object.isRequired
}

export default injectIntl(WalletSettingsFormRemote)
