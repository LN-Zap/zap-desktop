import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withFormApi, withFormState } from 'informed'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, DataRow, Input, Label, Range, Text, Toggle } from 'components/UI'
import messages from './messages'

class WalletSettingsFormLocal extends React.Component {
  static propTypes = {
    autopilotDefaults: PropTypes.object.isRequired,
    formApi: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    wallet: PropTypes.object.isRequired,
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
      autopilotAllocation,
    } = wallet

    return (
      <>
        <Box as="section" mb={4}>
          <Text fontWeight="normal">
            <FormattedMessage {...messages.section_basic_title} />
          </Text>
          <Bar mb={4} mt={2} />

          <DataRow left={<FormattedMessage {...messages.chain} />} py={2} right={chain} />
          <DataRow left={<FormattedMessage {...messages.network} />} py={2} right={network} />
        </Box>

        <Box as="section" mb={4}>
          <Text fontWeight="normal">
            <FormattedMessage {...messages.section_naming_title} />
          </Text>
          <Bar mb={4} mt={2} />

          <DataRow
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
                width={1}
              />
            }
          />

          <DataRow
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
            py={2}
            right={
              <Input
                css={{ 'text-align': 'right' }}
                field="alias"
                id="alias"
                justifyContent="right"
                ml="auto"
                placeholder={intl.formatMessage({
                  ...messages.wallet_settings_alias_placeholder,
                })}
                width={1}
              />
            }
          />
        </Box>

        <Box as="section" mb={4}>
          <DataRow
            left={
              <Label htmlFor="autopilot">
                <FormattedMessage {...messages.section_autopilot_title} />
              </Label>
            }
            mt={4}
            py={2}
            right={<Toggle field="autopilot" id="autopilot" />}
          />

          <Bar mb={4} mt={2} />

          {formState.values.autopilot ? (
            <>
              <DataRow
                left={
                  <Label htmlFor="autopilotAllocation">
                    <FormattedMessage {...messages.wallet_settings_autopilotAllocation_label} />
                  </Label>
                }
                py={2}
                right={
                  <Flex alignItems="center" justifyContent="flex-end">
                    <Range
                      field="autopilotAllocation"
                      id="autopilotAllocation"
                      initialValue={autopilotAllocation || autopilotDefaults.autopilotAllocation}
                      max="100"
                      min="0"
                      ml="auto"
                      sliderWidthNumber={200}
                      step="1"
                    />
                    <Input
                      css={{ 'text-align': 'right' }}
                      field="autopilotAllocation"
                      id="autopilotAllocation"
                      justifyContent="right"
                      max="100"
                      min="0"
                      ml={2}
                      step="1"
                      type="number"
                      width={70}
                    />
                  </Flex>
                }
              />

              <DataRow
                left={
                  <Label htmlFor="autopilotMaxchannels">
                    <FormattedMessage {...messages.wallet_settings_autopilotMaxchannels_label} />
                  </Label>
                }
                py={2}
                right={
                  <Input
                    css={{ 'text-align': 'right' }}
                    field="autopilotMaxchannels"
                    id="autopilotMaxchannels"
                    initialValue={autopilotMaxchannels || autopilotDefaults.autopilotMaxchannels}
                    justifyContent="right"
                    min="1"
                    ml="auto"
                    step="1"
                    type="number"
                    width={150}
                  />
                }
              />

              <DataRow
                left={
                  <Label htmlFor="autopilotMinchansize">
                    <FormattedMessage {...messages.wallet_settings_autopilotMinchansize_label} />
                  </Label>
                }
                py={2}
                right={
                  <Input
                    css={{ 'text-align': 'right' }}
                    field="autopilotMinchansize"
                    id="autopilotMinchansize"
                    initialValue={autopilotMinchansize || autopilotDefaults.autopilotMinchansize}
                    justifyContent="right"
                    max={autopilotDefaults.autopilotMaxchansize}
                    min={autopilotDefaults.autopilotMinchansize}
                    ml="auto"
                    step="1"
                    type="number"
                    width={150}
                  />
                }
              />

              <DataRow
                left={
                  <Label htmlFor="autopilotMaxchansize">
                    <FormattedMessage {...messages.wallet_settings_autopilotMaxchansize_label} />
                  </Label>
                }
                py={2}
                right={
                  <Input
                    css={{ 'text-align': 'right' }}
                    field="autopilotMaxchansize"
                    id="autopilotMaxchansize"
                    initialValue={autopilotMaxchansize || autopilotDefaults.autopilotMaxchansize}
                    justifyContent="right"
                    max={autopilotDefaults.autopilotMaxchansize}
                    min={autopilotDefaults.autopilotMinchansize}
                    ml="auto"
                    step="1"
                    type="number"
                    width={150}
                  />
                }
              />

              <Flex justifyContent="center" my={4}>
                <Button onClick={this.resetAutopilotSettings} size="small" type="button">
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
