import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Bar, Form, Header, Input, OpenDialogInput } from 'components/UI'
import ConnectionDetailsTabs from './ConnectionDetailsTabs'
import messages from './messages'

class ConnectionDetailsManual extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    connectionHost: PropTypes.string,
    connectionCert: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndCertError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    lndConnect: PropTypes.string,

    setLndconnect: PropTypes.func.isRequired,
    setConnectionHost: PropTypes.func.isRequired,
    setConnectionCert: PropTypes.func.isRequired,
    setConnectionMacaroon: PropTypes.func.isRequired,
    clearStartLndError: PropTypes.func.isRequired,
    validateHost: PropTypes.func.isRequired,
    validateCert: PropTypes.func.isRequired,
    validateMacaroon: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  componentDidMount() {
    const {
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      clearStartLndError
    } = this.props

    // If at least one of the fields has an error, set them all as touched so that they get highlighted.
    if (startLndHostError || startLndCertError || startLndMacaroonError) {
      this.formApi.setTouched('connectionHost', true)
      this.formApi.setTouched('connectionCert', true)
      this.formApi.setTouched('connectionMacaroon', true)
    }

    // If we have a connection error, set it into the form errors for the relevant field.
    if (startLndHostError) {
      this.formApi.setError('connectionHost', startLndHostError)
    }
    if (startLndCertError) {
      this.formApi.setError('connectionCert', startLndCertError)
    }
    if (startLndMacaroonError) {
      this.formApi.setError('connectionMacaroon', startLndMacaroonError)
    }

    // Clear connection erros now that we have used them.
    if (startLndHostError || startLndCertError || startLndMacaroonError) {
      clearStartLndError()
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
      connectionString,
      lndConnect,
      setConnectionHost,
      setConnectionCert,
      setConnectionMacaroon,
      setLndconnect,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      clearStartLndError,
      validateHost,
      validateCert,
      validateMacaroon,
      ...rest
    } = this.props
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
        {({ formState }) => {
          const shouldValidateInline =
            formState.submits > 0 ||
            connectionHost ||
            connectionCert ||
            connectionMacaroon ||
            startLndHostError ||
            startLndCertError ||
            startLndMacaroonError

          return (
            <>
              <Header
                title={<FormattedMessage {...messages.connection_details_custom_title} />}
                subtitle={<FormattedMessage {...messages.connection_details_custom_description} />}
                align="left"
              />

              <Bar mt={4} mb={1} />

              <ConnectionDetailsTabs mb={3} />

              <Input
                autoFocus
                field="connectionHost"
                name="connectionHost"
                mb={3}
                label={<FormattedMessage {...messages.hostname_title} />}
                description={<FormattedMessage {...messages.hostname_description} />}
                initialValue={connectionHost}
                onValueChange={this.handleConnectionHostChange}
                validateOnBlur={shouldValidateInline}
                validateOnChange={shouldValidateInline}
                asyncValidate={this.validateHost}
                required
              />

              <OpenDialogInput
                field="connectionCert"
                name="connectionCert"
                width={1}
                label={<FormattedMessage {...messages.cert_title} />}
                description={<FormattedMessage {...messages.cert_description} />}
                initialValue={connectionCert}
                onValueChange={this.handleConnectionCertChange}
                validateOnBlur={shouldValidateInline}
                validateOnChange={shouldValidateInline}
                asyncValidate={this.validateCert}
                required
              />

              <OpenDialogInput
                field="connectionMacaroon"
                name="connectionMacaroon"
                label="Macaroon"
                width={1}
                description={<FormattedMessage {...messages.macaroon_description} />}
                initialValue={connectionMacaroon}
                onValueChange={this.handleConnectionMacaroonChange}
                validateOnBlur={shouldValidateInline}
                validateOnChange={shouldValidateInline}
                asyncValidate={this.validateMacaroon}
                required
              />
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ConnectionDetailsManual)
