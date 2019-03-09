import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Form, Header, RadioGroup, Radio } from 'components/UI'
import messages from './messages'

class ConnectionType extends React.Component {
  static propTypes = {
    connectionType: PropTypes.string,
    lndConnect: PropTypes.string,
    resetOnboarding: PropTypes.func.isRequired,
    setConnectionType: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  componentDidMount() {
    const { lndConnect, resetOnboarding, stopLnd } = this.props
    stopLnd()
    if (lndConnect) {
      this.formApi.setValue('connectionType', 'custom')
      this.formApi.submitForm()
    } else {
      resetOnboarding()
    }
  }

  componentDidUpdate(prevProps) {
    const { lndConnect } = this.props
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      this.formApi.setValue('connectionType', 'custom')
      this.formApi.submitForm()
    }
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
      lndConnect,
      setConnectionType,
      resetOnboarding,
      stopLnd,
      ...rest
    } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState
    return (
      <Box css={{ visibility: lndConnect ? 'hidden' : 'visible' }}>
        <Header
          align="left"
          subtitle={<FormattedMessage {...messages.connection_description} />}
          title={<FormattedMessage {...messages.connection_title} />}
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
          onSubmit={values => {
            this.handleSubmit(values)
            if (onSubmit) {
              onSubmit(values)
            }
          }}
          onSubmitFailure={onSubmitFailure}
        >
          <RadioGroup
            field="connectionType"
            initialValue={connectionType}
            isRequired
            name="connectionType"
          >
            <Radio
              description={<FormattedMessage {...messages.connection_type_create_description} />}
              label={<FormattedMessage {...messages.connection_type_create_label} />}
              mb={5}
              value="create"
            />

            <Radio
              description={<FormattedMessage {...messages.connection_type_import_description} />}
              label={<FormattedMessage {...messages.connection_type_import_label} />}
              mb={5}
              value="import"
            />

            <Radio
              description={<FormattedMessage {...messages.connection_type_custom_description} />}
              label={<FormattedMessage {...messages.connection_type_custom_label} />}
              value="custom"
            />
          </RadioGroup>
        </Form>
      </Box>
    )
  }
}

export default ConnectionType
