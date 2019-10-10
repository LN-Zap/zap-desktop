import React from 'react'
import PropTypes from 'prop-types'
import config from 'config'
import { compose } from 'redux'
import { withFormApi, withFormState } from 'informed'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'
import uniq from 'lodash/uniq'
import { intlShape } from '@zap/i18n'
import { Bar, Button, DataRow, Text } from 'components/UI'
import { Input, Label, Toggle, TextArea, FieldLabelFactory } from 'components/Form'
import messages from './messages'
import AutopilotAllocation from './AutopilotAllocation'

const FieldLabel = FieldLabelFactory(messages)

// de-dupes, trims, removes empty neutrino hosts
export const sanitizeNeutrinoNodes = nodes =>
  nodes && uniq(nodes.filter(Boolean).map(n => n.trim()))

// performs current neutrino nodes urls validation
export const validateNeutrinoNodes = async formApi => {
  const field = 'neutrinoNodes'
  const value = sanitizeNeutrinoNodes(formApi.getValue(field))
  if (!value) {
    return
  }

  const validatorWrapper = async host => {
    try {
      return await window.Zap.validateHost(host)
    } catch (e) {
      return e.toString()
    }
  }

  const result = await Promise.all(value.map(validatorWrapper))

  if (result.every(v => v === true)) {
    formApi.setError(field, undefined)
  } else {
    // display first error
    formApi.setError(field, result.find(v => v !== true))
  }
}

// informed parser for neutrinoNodes field
const parseNeutrinoNodes = value => {
  if (Array.isArray(value)) {
    return value
  }

  return value.split('\n')
}

// informed formatter for neutrinoNodes field
const formatNeutrinoNodes = value => value && value.join('\n')

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

  resetNeutrinoSettings = () => {
    const { formApi, wallet } = this.props
    const { chain, network } = wallet
    formApi.setValue('neutrinoNodes', config.lnd.neutrino[chain][network])
  }

  validateHost = async () => {
    const { formApi, formState } = this.props
    return formState.submits && (await validateNeutrinoNodes(formApi))
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
            left={<FieldLabel itemKey="wallet_settings_name" />}
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

          <DataRow
            left={<FieldLabel itemKey="wallet_settings_alias" />}
            py={2}
            right={
              <Input
                allowEmptyString
                field="alias"
                id="alias"
                justifyContent="flex-end"
                ml="auto"
                placeholder={intl.formatMessage({
                  ...messages.wallet_settings_alias_placeholder,
                })}
                textAlign="right"
                width={250}
              />
            }
          />
        </Box>

        <Box as="section" mb={4}>
          <Text fontWeight="normal">
            <FormattedMessage {...messages.section_naming_connections} />
          </Text>
          <Bar mb={4} mt={2} />
          <DataRow
            left={<FieldLabel itemKey="neutrinoUrl" tooltip="neutrinoUrl_tooltip" />}
            right={
              <TextArea
                field="neutrinoNodes"
                format={formatNeutrinoNodes}
                highlightOnValid={false}
                initialValue={config.lnd.neutrino[chain][network]}
                onBlur={this.validateHost}
                onChange={this.validateHost}
                parse={parseNeutrinoNodes}
                width={300}
              />
            }
          />
          <Flex justifyContent="center" my={4}>
            <Button onClick={this.resetNeutrinoSettings} size="small" type="button">
              <FormattedMessage {...messages.wallet_settings_reset_neutrino_button_text} />
            </Button>
          </Flex>
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

          {formState.values.autopilot && (
            <>
              <DataRow
                left={
                  <Label htmlFor="autopilotAllocation">
                    <FormattedMessage {...messages.wallet_settings_autopilotAllocation_label} />
                  </Label>
                }
                py={2}
                right={
                  <AutopilotAllocation
                    field="autopilotAllocation"
                    initialValue={autopilotAllocation || autopilotDefaults.autopilotAllocation}
                    sliderWidthNumber={200}
                  />
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
                    field="autopilotMaxchannels"
                    id="autopilotMaxchannels"
                    initialValue={autopilotMaxchannels || autopilotDefaults.autopilotMaxchannels}
                    justifyContent="flex-end"
                    min="1"
                    ml="auto"
                    step="1"
                    textAlign="right"
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
                    field="autopilotMinchansize"
                    id="autopilotMinchansize"
                    initialValue={autopilotMinchansize || autopilotDefaults.autopilotMinchansize}
                    justifyContent="flex-end"
                    max={autopilotDefaults.autopilotMaxchansize}
                    min={autopilotDefaults.autopilotMinchansize}
                    ml="auto"
                    step="1"
                    textAlign="right"
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
                    field="autopilotMaxchansize"
                    id="autopilotMaxchansize"
                    initialValue={autopilotMaxchansize || autopilotDefaults.autopilotMaxchansize}
                    justifyContent="flex-end"
                    max={autopilotDefaults.autopilotMaxchansize}
                    min={autopilotDefaults.autopilotMinchansize}
                    ml="auto"
                    step="1"
                    textAlign="right"
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
          )}
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
