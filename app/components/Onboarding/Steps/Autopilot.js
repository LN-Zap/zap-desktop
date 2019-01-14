import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar, Form, Header, RadioGroup, Radio } from 'components/UI'
import messages from './messages'

class Autopilot extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    autopilot: PropTypes.bool,
    setAutopilot: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    autopilot: 'enable'
  }

  handleSubmit = values => {
    const { setAutopilot } = this.props
    setAutopilot(values.autopilot === 'enable' ? true : false)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wizardApi, wizardState, autopilot, setAutopilot, ...rest } = this.props
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
          title={<FormattedMessage {...messages.autopilot_title} />}
          subtitle={<FormattedMessage {...messages.autopilot_description} />}
          align="left"
        />
        <Bar my={4} />
        <RadioGroup
          required
          field="autopilot"
          name="autopilot"
          initialValue={autopilot ? 'enable' : 'disable'}
        >
          <Radio value="enable" label={<FormattedMessage {...messages.enable} />} />

          <Radio value="disable" label={<FormattedMessage {...messages.disable} />} />
        </RadioGroup>
      </Form>
    )
  }
}

export default Autopilot
