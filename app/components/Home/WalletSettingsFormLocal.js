import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { DataRow, Form, Input, Label, Range, Toggle } from 'components/UI'
import * as yup from 'yup'

class WalletSettingsFormLocal extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    startLnd: PropTypes.func.isRequired
  }

  validateAutopilot = value => {
    try {
      yup.boolean().validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  validateAutopilotAllocation = value => {
    try {
      yup
        .number()
        .required()
        .positive()
        .min(0)
        .max(100)
        .typeError('A number is required')
        .validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  validateAutopilotMaxchannels = value => {
    try {
      yup
        .number()
        .required()
        .positive()
        .integer()
        .max(100)
        .typeError('A number is required')
        .validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  validateAutopilotChansize = value => {
    try {
      yup
        .number()
        .required()
        .positive()
        .integer()
        .max(100000000)
        .typeError('A number is required')
        .validateSync(value)
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
    const { wallet, startLnd, ...rest } = this.props

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
            <DataRow
              py={2}
              left={<Label htmlFor="alias">Alias</Label>}
              right={<Input field="alias" id="alias" initialValue={wallet.alias} width={1} />}
            />

            <DataRow
              py={2}
              left={<Label htmlFor="autopilot">Autopilot</Label>}
              right={
                <Toggle
                  field="autopilot"
                  id="autopilot"
                  validate={this.validateAutopilot}
                  validateOnBlur
                  validateOnChange={formState.invalid}
                  initialValue={wallet.autopilot}
                />
              }
            />

            {formState.values.autopilot ? (
              <React.Fragment>
                <DataRow
                  py={2}
                  left={<Label htmlFor="autopilotAllocation">Percentage of Balance</Label>}
                  right={
                    <Flex alignItems="center" ml="auto">
                      <Range
                        field="autopilotAllocation"
                        id="autopilotAllocation"
                        initialValue={wallet.autopilotAllocation * 100}
                        validate={this.validateAutopilotAllocation}
                        validateOnChange={formState.invalid}
                        validateOnBlur
                        ml="auto"
                        min="0"
                        max="100"
                        step="1"
                        width={1}
                      />
                      <Input
                        field="autopilotAllocation"
                        id="autopilotAllocation"
                        type="number"
                        variant="thin"
                        ml={2}
                        width={100}
                      />
                    </Flex>
                  }
                />

                <DataRow
                  py={2}
                  left={<Label htmlFor="autopilotMaxchannels">Number of Channels max</Label>}
                  right={
                    <Input
                      field="autopilotMaxchannels"
                      id="autopilotMaxchannels"
                      variant="thin"
                      type="number"
                      initialValue={wallet.autopilotMaxchannels}
                      validate={this.validateAutopilotMaxchannels}
                      validateOnChange={formState.invalid}
                      validateOnBlur
                      step="1"
                      width={100}
                      ml="auto"
                    />
                  }
                />

                <DataRow
                  py={2}
                  left={<Label htmlFor="autopilotMinchansize">Minimum channel size</Label>}
                  right={
                    <Input
                      field="autopilotMinchansize"
                      id="autopilotMinchansize"
                      variant="thin"
                      type="number"
                      min="0"
                      max="100000000"
                      step="1"
                      initialValue={wallet.autopilotMinchansize}
                      validate={this.validateAutopilotChansize}
                      validateOnBlur
                      validateOnChange={formState.invalid}
                      width={100}
                      ml="auto"
                    />
                  }
                />

                <DataRow
                  py={2}
                  left={<Label htmlFor="autopilotMaxchansize">Maximum channel size</Label>}
                  right={
                    <Input
                      field="autopilotMaxchansize"
                      id="autopilotMaxchansize"
                      variant="thin"
                      type="number"
                      min="0"
                      max="100000000"
                      step="1"
                      initialValue={wallet.autopilotMaxchansize}
                      validate={this.validateAutopilotChansize}
                      validateOnChange={formState.invalid}
                      validateOnBlur
                      width={100}
                      ml="auto"
                    />
                  }
                />
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </Form>
    )
  }
}

export default WalletSettingsFormLocal
