import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Form, RadioGroup, Radio } from 'components/Form'
import { Bar, Header } from 'components/UI'

import messages from './messages'

class Autopilot extends React.Component {
  static propTypes = {
    autopilot: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
    setAutopilot: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    autopilot: 'enable',
  }

  handleSubmit = values => {
    const { setAutopilot } = this.props
    setAutopilot(values.autopilot === 'enable')
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, autopilot, ...rest } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState
    return (
      <Form
        {...rest}
        getApi={formApi => {
          this.setFormApi(formApi)
          if (getApi) {
            getApi(formApi)
          }
        }}
        onChange={onChange && (formState => onChange(formState, currentItem))}
        onSubmit={values => {
          this.handleSubmit(values)
          if (onSubmit) {
            onSubmit(values)
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        <Header
          subtitle={<FormattedMessage {...messages.autopilot_description} />}
          title={<FormattedMessage {...messages.autopilot_title} />}
        />
        <Bar my={4} />
        <RadioGroup
          field="autopilot"
          initialValue={autopilot ? 'enable' : 'disable'}
          isRequired
          name="autopilot"
        >
          <Radio label={<FormattedMessage {...messages.enable} />} value="enable" />

          <Radio label={<FormattedMessage {...messages.disable} />} value="disable" />
        </RadioGroup>
      </Form>
    )
  }
}

export default Autopilot
