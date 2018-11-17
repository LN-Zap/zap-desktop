import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Button, DataRow, Form, Input, Label, Range, Text, Toggle } from 'components/UI'
import * as yup from 'yup'
import messages from './messages'

class WalletSettingsFormLocal extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    startLnd: PropTypes.func.isRequired
  }

  resetAutopilotSettings = () => {
    const defaults = {
      autopilotMaxchannels: 5,
      autopilotMinchansize: 20000,
      autopilotMaxchansize: 16777215,
      autopilotAllocation: 60
    }
    Object.entries(defaults).forEach(([field, value]) => {
      this.formApi.setValue(field, value)
    })
  }

  validateAutopilot = value => {
    try {
      yup.boolean().validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  preSubmit = values => {
    if (values.autopilotAllocation) {
      values.autopilotAllocation = values.autopilotAllocation / 100
    }
    return values
  }

  onSubmit = async values => {
    const { startLnd } = this.props
    return startLnd(values)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { intl, wallet, startLnd, ...rest } = this.props

    return (
      <Form
        getApi={this.setFormApi}
        preSubmit={this.preSubmit}
        onSubmit={this.onSubmit}
        {...rest}
        initialValues={wallet}
        wallet={wallet}
      >
        {({ formState }) => (
          <React.Fragment>
            <Box mb={4} as="section">
              <Text fontWeight="normal">
                <FormattedMessage {...messages.section_basic_title} />
              </Text>
              <Bar mt={2} mb={4} />

              <DataRow
                py={2}
                left={<FormattedMessage {...messages.chain} />}
                right={wallet.chain}
              />
              <DataRow
                py={2}
                left={<FormattedMessage {...messages.network} />}
                right={wallet.network}
              />
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
                    initialValue={wallet.name}
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
                    initialValue={wallet.alias}
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
                right={<Toggle field="autopilot" id="autopilot" initialValue={wallet.autopilot} />}
              />

              <Bar mt={2} mb={4} />

              {formState.values.autopilot ? (
                <React.Fragment>
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
                          initialValue={wallet.autopilotAllocation * 100}
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
                        <FormattedMessage
                          {...messages.wallet_settings_autopilotMaxchannels_label}
                        />
                      </Label>
                    }
                    right={
                      <Input
                        field="autopilotMaxchannels"
                        id="autopilotMaxchannels"
                        type="number"
                        initialValue={wallet.autopilotMaxchannels}
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
                        <FormattedMessage
                          {...messages.wallet_settings_autopilotMinchansize_label}
                        />
                      </Label>
                    }
                    right={
                      <Input
                        field="autopilotMinchansize"
                        id="autopilotMinchansize"
                        type="number"
                        min="20000"
                        max="16777215"
                        step="1"
                        initialValue={wallet.autopilotMinchansize}
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
                        <FormattedMessage
                          {...messages.wallet_settings_autopilotMaxchansize_label}
                        />
                      </Label>
                    }
                    right={
                      <Input
                        field="autopilotMaxchansize"
                        id="autopilotMaxchansize"
                        type="number"
                        min="20000"
                        max="16777215"
                        step="1"
                        initialValue={wallet.autopilotMaxchansize}
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
                </React.Fragment>
              ) : null}
            </Box>
          </React.Fragment>
        )}
      </Form>
    )
  }
}

export default injectIntl(WalletSettingsFormLocal)
