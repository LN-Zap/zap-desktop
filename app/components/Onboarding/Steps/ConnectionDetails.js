import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Form, Header, Input } from 'components/UI'
import messages from './messages'

class ConnectionDetails extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    connectionHost: PropTypes.string,
    connectionCert: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndCertError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    lndConnect: PropTypes.object,

    setLndconnect: PropTypes.func.isRequired,
    setConnectionHost: PropTypes.func.isRequired,
    setConnectionCert: PropTypes.func.isRequired,
    setConnectionMacaroon: PropTypes.func.isRequired,
    validateHost: PropTypes.func.isRequired,
    validateCert: PropTypes.func.isRequired,
    validateMacaroon: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    connectionHost: '',
    connectionCert: '',
    connectionMacaroon: '',
    startLndHostError: '',
    startLndCertError: '',
    startLndMacaroonError: ''
  }

  componentDidMount() {
    const { props, formApi } = this
    const {
      lndConnect,
      setLndconnect,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError
    } = props
    if (startLndHostError) {
      this.formApi.setError('connectionHost', startLndHostError)
    }
    if (startLndCertError) {
      this.formApi.setError('connectionCert', startLndCertError)
    }
    if (startLndMacaroonError) {
      this.formApi.setError('connectionMacaroon', startLndMacaroonError)
    }

    if (lndConnect) {
      const fields = ['connectionHost', 'connectionCert', 'connectionMacaroon']
      fields.forEach(field => {
        if (lndConnect[field] !== formApi.getValue(field)) {
          this.formApi.setValue(field, lndConnect[field])
          this.formApi.setTouched(field, true)
        }
      })
      setLndconnect(null)
    }
  }

  componentDidUpdate(prevProps) {
    const { props, formApi } = this
    const { setLndconnect, lndConnect } = props
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      const fields = ['connectionHost', 'connectionCert', 'connectionMacaroon']
      fields.forEach(field => {
        if (lndConnect[field] !== formApi.getValue(field)) {
          this.formApi.setValue(field, lndConnect[field])
          this.formApi.setTouched(field, true)
        }
      })
      setLndconnect(null)
    }
  }

  handleConnectionHostChange = () => {
    const formState = this.formApi.getState()
    delete formState.asyncErrors.connectionHost
    this.formApi.setState(formState)
  }

  handleConnectionCertChange = () => {
    const formState = this.formApi.getState()
    delete formState.asyncErrors.connectionCert
    this.formApi.setState(formState)
  }

  handleConnectionMacaroonChange = () => {
    const formState = this.formApi.getState()
    delete formState.asyncErrors.connectionMacaroon
    this.formApi.setState(formState)
  }

  handleSubmit = values => {
    const { setConnectionHost, setConnectionCert, setConnectionMacaroon } = this.props
    setConnectionHost(values.connectionHost)
    setConnectionCert(values.connectionCert)
    setConnectionMacaroon(values.connectionMacaroon)
  }

  validateHost = async value => {
    const { validateHost } = this.props
    try {
      await validateHost(value)
    } catch (e) {
      return e.toString()
    }
  }

  validateCert = async value => {
    const { validateCert } = this.props
    try {
      await validateCert(value)
    } catch (e) {
      return e.toString()
    }
  }

  validateMacaroon = async value => {
    const { validateMacaroon } = this.props
    try {
      await validateMacaroon(value)
    } catch (e) {
      return e.toString()
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      wizardApi,
      wizardState,
      connectionHost,
      connectionCert,
      connectionMacaroon,
      lndConnect,
      setConnectionHost,
      setConnectionCert,
      setConnectionMacaroon,
      setLndconnect,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      validateHost,
      validateCert,
      validateMacaroon,
      ...rest
    } = this.props
    const { getApi, onChange, preSubmit, onSubmit, onSubmitFailure } = wizardApi
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
        preSubmit={preSubmit}
        onSubmit={values => {
          this.handleSubmit(values)
          if (onSubmit) {
            onSubmit(values)
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        {({ formState }) => {
          const shouldValidateInline =
            formState.submits > 0 || startLndHostError || startLndCertError || startLndMacaroonError
          return (
            <>
              <Header
                title={<FormattedMessage {...messages.connection_details_custom_title} />}
                subtitle={<FormattedMessage {...messages.connection_details_custom_description} />}
                align="left"
              />

              <Bar my={4} />

              <Box mb={3}>
                <Input
                  autoFocus
                  field="connectionHost"
                  name="connectionHost"
                  label={<FormattedMessage {...messages.hostname_title} />}
                  description={<FormattedMessage {...messages.hostname_description} />}
                  initialValue={connectionHost}
                  onValueChange={this.handleConnectionHostChange}
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  asyncValidate={this.validateHost}
                  required
                />
              </Box>

              <Box mb={3}>
                <Input
                  field="connectionCert"
                  name="connectionCert"
                  label={<FormattedMessage {...messages.cert_title} />}
                  description={<FormattedMessage {...messages.cert_description} />}
                  initialValue={connectionCert}
                  onValueChange={this.handleConnectionCertChange}
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  asyncValidate={this.validateCert}
                  required
                />
              </Box>

              <Box mb={3}>
                <Input
                  field="connectionMacaroon"
                  name="connectionMacaroon"
                  label="Macaroon"
                  description={<FormattedMessage {...messages.macaroon_description} />}
                  initialValue={connectionMacaroon}
                  onValueChange={this.handleConnectionMacaroonChange}
                  validateOnBlur={shouldValidateInline}
                  validateOnChange={shouldValidateInline}
                  asyncValidate={this.validateMacaroon}
                  required
                />
              </Box>
            </>
          )
        }}
      </Form>
    )
  }
}

export default ConnectionDetails
