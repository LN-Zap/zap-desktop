import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar, Form, Header, RadioGroup, Radio } from 'components/UI'
import messages from './messages'

class ConnectionType extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    resetOnboarding: PropTypes.func.isRequired,
    setConnectionType: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  componentDidMount() {
    const { resetOnboarding, stopLnd } = this.props
    stopLnd()
    resetOnboarding()
  }

  handleSubmit = values => {
    const { setConnectionType } = this.props
    setConnectionType(values.connectionType)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      wizardApi,
      wizardState,
      connectionType,
      setConnectionType,
      resetOnboarding,
      stopLnd,
      ...rest
    } = this.props
    const { getApi, onChange, preSubmit, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState
    return (
      <>
        <Header
          title={<FormattedMessage {...messages.connection_title} />}
          subtitle={<FormattedMessage {...messages.connection_description} />}
          align="left"
        />

        <Bar my={4} />

        <Form
          {...rest}
          getApi={formApi => {
            this.setFormApi(formApi)
            if (getApi) {
              getApi(formApi)
            }
          }}
          onChange={onChange && (formState => onChange(formState, currentItem))}
          preSubmit={preSubmit}
          onSubmit={values => {
            this.handleSubmit(values)
            if (onSubmit) {
              onSubmit(values)
            }
          }}
          onSubmitFailure={onSubmitFailure}
        >
          <RadioGroup
            required
            field="connectionType"
            name="connectionType"
            initialValue={connectionType}
          >
            <Radio
              value="create"
              label={<FormattedMessage {...messages.connection_type_create_label} />}
              description={<FormattedMessage {...messages.connection_type_create_description} />}
              mb={4}
            />

            <Radio
              value="import"
              label={<FormattedMessage {...messages.connection_type_import_label} />}
              description={<FormattedMessage {...messages.connection_type_import_description} />}
              mb={4}
            />

            <Radio
              value="custom"
              label={<FormattedMessage {...messages.connection_type_custom_label} />}
              description={<FormattedMessage {...messages.connection_type_custom_description} />}
              mb={4}
            />

            <Radio
              value="btcpayserver"
              label={<FormattedMessage {...messages.connection_type_btcpayserver_label} />}
              description={
                <FormattedMessage {...messages.connection_type_btcpayserver_description} />
              }
              mb={4}
            />
          </RadioGroup>
        </Form>
      </>
    )
  }
}

export default ConnectionType
