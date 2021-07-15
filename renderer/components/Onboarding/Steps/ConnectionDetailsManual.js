import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'

import { Form, Input, OpenDialogInput } from 'components/Form'
import { Bar, Header } from 'components/UI'

import ConnectionDetailsTabs from './ConnectionDetailsTabs'
import messages from './messages'

class ConnectionDetailsManual extends React.Component {
  static propTypes = {
    clearStartLndError: PropTypes.func.isRequired,
    connectionCert: PropTypes.string,
    connectionHost: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    lndConnect: PropTypes.string,
    name: PropTypes.string,
    setConnectionCert: PropTypes.func.isRequired,
    setConnectionHost: PropTypes.func.isRequired,
    setConnectionMacaroon: PropTypes.func.isRequired,
    setLndconnect: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,

    startLndCertError: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    validateCert: PropTypes.func.isRequired,
    validateHost: PropTypes.func.isRequired,
    validateMacaroon: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    name: null,
  }

  componentDidMount() {
    const {
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      clearStartLndError,
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

  asyncValidateField = async (field, validator) => {
    const value = this.formApi.getValue(field)
    if (!value) {
      return
    }

    const validatorWrapper = async () => {
      try {
        await validator(value)
        return null
      } catch (e) {
        return e.toString()
      }
    }

    const result = await validatorWrapper(field, validator)
    if (result) {
      this.formApi.setError(field, result)
    } else {
      this.formApi.setError(field, undefined)
    }
  }

  handleSubmit = values => {
    const { setConnectionHost, setConnectionCert, setConnectionMacaroon, setName } = this.props
    setConnectionHost(values.connectionHost)
    setConnectionCert(values.connectionCert)
    setConnectionMacaroon(values.connectionMacaroon)
    setName(values.name)
  }

  validateHost = () => {
    const { validateHost } = this.props
    return this.asyncValidateField('connectionHost', validateHost)
  }

  validateCert = () => {
    const { validateCert } = this.props
    return this.asyncValidateField('connectionCert', validateCert)
  }

  validateMacaroon = () => {
    const { validateMacaroon } = this.props
    return this.asyncValidateField('connectionMacaroon', validateMacaroon)
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
      name,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      ...rest
    } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState
    return (
      <Form
        {...rest}
        asyncValidators={[this.validateHost, this.validateCert, this.validateMacaroon]}
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
          const willValidateInline =
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
                subtitle={<FormattedMessage {...messages.connection_details_custom_description} />}
                title={<FormattedMessage {...messages.connection_details_custom_title} />}
              />

              <Bar mb={1} mt={4} />

              <ConnectionDetailsTabs mb={3} />

              <Input
                description={<FormattedMessage {...messages.hostname_description} />}
                field="connectionHost"
                initialValue={connectionHost}
                isRequired
                label={<FormattedMessage {...messages.hostname_title} />}
                mb={3}
                name="connectionHost"
                onBlur={this.validateHost}
                willAutoFocus
              />

              <OpenDialogInput
                description={<FormattedMessage {...messages.cert_description} />}
                field="connectionCert"
                initialValue={connectionCert}
                isRequired
                label={<FormattedMessage {...messages.cert_title} />}
                mb={3}
                name="connectionCert"
                onBlur={this.validateCert}
                validateOnBlur={willValidateInline}
                validateOnChange={willValidateInline}
                width={1}
              />

              <OpenDialogInput
                description={<FormattedMessage {...messages.macaroon_description} />}
                field="connectionMacaroon"
                initialValue={connectionMacaroon}
                isRequired
                label="Macaroon"
                mb={3}
                name="connectionMacaroon"
                onBlur={this.validateMacaroon}
                validateOnBlur={willValidateInline}
                validateOnChange={willValidateInline}
                width={1}
              />

              <Input
                description={<FormattedMessage {...messages.wallet_name_description} />}
                field="name"
                initialValue={name}
                label={<FormattedMessage {...messages.wallet_name_label} />}
                maxLength={30}
                name="name"
              />
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ConnectionDetailsManual)
