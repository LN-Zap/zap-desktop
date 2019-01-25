import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withFormApi, withFormState } from 'informed'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, DataRow, Input, Label, Range, Text, Toggle } from 'components/UI'
import messages from './messages'

class WalletSettingsFormLocal extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired
  }

  resetAutopilotSettings = () => {
    const { formApi, autopilotDefaults } = this.props

    Object.entries(autopilotDefaults).forEach(([field, value]) => {
      formApi.setValue(field, value)
    })
  }

  render() {
    const { intl, formState, autopilotDefaults, wallet } = this.props
    const { chain, network } = wallet

    const {
      autopilotMaxchannels,
      autopilotMinchansize,
      autopilotMaxchansize,
      autopilotAllocation
    } = wallet

    return (
      <>
        <Box mb={4} as="section">
          <Text fontWeight="normal">
            <FormattedMessage {...messages.section_basic_title} />
          </Text>
          <Bar mt={2} mb={4} />

          <DataRow py={2} left={<FormattedMessage {...messages.chain} />} right={chain} />
          <DataRow py={2} left={<FormattedMessage {...messages.network} />} right={network} />
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

          <DataRow
            py={2}
            left={
              <>
                <Label htmlFor="alias" mb={2}>
                  <FormattedMessage {...messages.wallet_settings_alias_label} />
                </Label>
                <Text color="gray" fontWeight="light">
                  <FormattedMessage {...messages.wallet_settings_alias_description} />
                </Text>
              </>
            }
            right={
              <Input
                field="alias"
                id="alias"
                placeholder={intl.formatMessage({
                  ...messages.wallet_settings_alias_placeholder
                })}
                width={1}
                ml="auto"
                justifyContent="right"
                css={{ 'text-align': 'right' }}
              />
            }
          />
        </Box>

        <Box mb={4} as="section">
          <DataRow
            py={2}
            mt={4}
            left={
              <Label htmlFor="autopilot">
                <FormattedMessage {...messages.section_autopilot_title} />
              </Label>
            }
            right={<Toggle field="autopilot" id="autopilot" />}
          />

          <Bar mt={2} mb={4} />

          {formState.values.autopilot ? (
            <>
              <DataRow
                py={2}
                left={
                  <Label htmlFor="autopilotAllocation">
                    <FormattedMessage {...messages.wallet_settings_autopilotAllocation_label} />
                  </Label>
                }
                right={
                  <Flex alignItems="center" justifyContent="flex-end">
                    <Range
                      field="autopilotAllocation"
                      id="autopilotAllocation"
                      initialValue={autopilotAllocation || autopilotDefaults.autopilotAllocation}
                      min="0"
                      max="100"
                      step="1"
                      sliderWidthNumber={200}
                      ml="auto"
                    />
                    <Input
                      field="autopilotAllocation"
                      id="autopilotAllocation"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      width={70}
                      ml={2}
                      justifyContent="right"
                      css={{ 'text-align': 'right' }}
                    />
                  </Flex>
                }
              />

              <DataRow
                py={2}
                left={
                  <Label htmlFor="autopilotMaxchannels">
                    <FormattedMessage {...messages.wallet_settings_autopilotMaxchannels_label} />
                  </Label>
                }
                right={
                  <Input
                    field="autopilotMaxchannels"
                    id="autopilotMaxchannels"
                    initialValue={autopilotMaxchannels || autopilotDefaults.autopilotMaxchannels}
                    type="number"
                    min="1"
                    step="1"
                    width={150}
                    ml="auto"
                    justifyContent="right"
                    css={{ 'text-align': 'right' }}
                  />
                }
              />

              <DataRow
                py={2}
                left={
                  <Label htmlFor="autopilotMinchansize">
                    <FormattedMessage {...messages.wallet_settings_autopilotMinchansize_label} />
                  </Label>
                }
                right={
                  <Input
                    field="autopilotMinchansize"
                    id="autopilotMinchansize"
                    type="number"
                    min={autopilotDefaults.autopilotMinchansize}
                    max={autopilotDefaults.autopilotMaxchansize}
                    initialValue={autopilotMinchansize || autopilotDefaults.autopilotMinchansize}
                    step="1"
                    width={150}
                    ml="auto"
                    justifyContent="right"
                    css={{ 'text-align': 'right' }}
                  />
                }
              />

              <DataRow
                py={2}
                left={
                  <Label htmlFor="autopilotMaxchansize">
                    <FormattedMessage {...messages.wallet_settings_autopilotMaxchansize_label} />
                  </Label>
                }
                right={
                  <Input
                    field="autopilotMaxchansize"
                    id="autopilotMaxchansize"
                    type="number"
                    min={autopilotDefaults.autopilotMinchansize}
                    max={autopilotDefaults.autopilotMaxchansize}
                    initialValue={autopilotMaxchansize || autopilotDefaults.autopilotMaxchansize}
                    step="1"
                    width={150}
                    ml="auto"
                    justifyContent="right"
                    css={{ 'text-align': 'right' }}
                  />
                }
              />

              <Flex justifyContent="center" my={4}>
                <Button type="button" size="small" onClick={this.resetAutopilotSettings}>
                  <FormattedMessage {...messages.wallet_settings_reset_autopilot_button_text} />
                </Button>
              </Flex>
            </>
          ) : null}
        </Box>
      </>
    )
  }
}

export default compose(
  withFormApi,
  withFormState,
  injectIntl
)(WalletSettingsFormLocal)
