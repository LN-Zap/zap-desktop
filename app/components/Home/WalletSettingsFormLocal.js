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
              right={
                <Input
                  field="alias"
                  id="alias"
                  initialValue={wallet.alias}
                  width={1}
                  ml="auto"
                  justifyContent="right"
                  css={{ 'text-align': 'right' }}
                />
              }
            />

            <DataRow
              py={2}
              left={<Label htmlFor="autopilot">Autopilot</Label>}
              right={<Toggle field="autopilot" id="autopilot" initialValue={wallet.autopilot} />}
            />

            {formState.values.autopilot ? (
              <React.Fragment>
                <DataRow
                  py={2}
                  left={<Label htmlFor="autopilotAllocation">Percentage of Balance</Label>}
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
                        variant="thin"
                        min="0"
                        max="100"
                        step="1"
                        width={50}
                        ml={2}
                        justifyContent="right"
                        css={{ 'text-align': 'right' }}
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
                      step="1"
                      width={100}
                      ml="auto"
                      justifyContent="right"
                      css={{ 'text-align': 'right' }}
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
                      width={100}
                      ml="auto"
                      justifyContent="right"
                      css={{ 'text-align': 'right' }}
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
                      width={100}
                      ml="auto"
                      justifyContent="right"
                      css={{ 'text-align': 'right' }}
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
