import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass/styled-components'

import { Form, Input, LndConnectionStringInput } from 'components/Form'
import { Bar, Header } from 'components/UI'

import ConnectionDetailsTabs from './ConnectionDetailsTabs'
import messages from './messages'

class ConnectionDetailsString extends React.Component {
  static propTypes = {
    clearStartLndError: PropTypes.func.isRequired,
    connectionString: PropTypes.string,
    lndConnect: PropTypes.string,
    name: PropTypes.string,
    setConnectionString: PropTypes.func.isRequired,
    setLndconnect: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    startLndCertError: PropTypes.string,
    startLndHostError: PropTypes.string,

    startLndMacaroonError: PropTypes.string,
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
      setLndconnect,
      lndConnect,
    } = this.props

    // If we have an lndConnect link, populate the form annd submit immediately.
    if (lndConnect) {
      this.formApi.setValue('connectionString', lndConnect)
      this.formApi.setTouched('connectionString', true)
      this.formApi.submitForm()
      setLndconnect(null)
      return
    }

    // If we have an error, set the field as touched so that it gets highlighted.
    if (startLndHostError || startLndCertError || startLndMacaroonError) {
      this.formApi.setTouched('connectionString', true)
    }

    // PAss any connection errors onto the form field.
    if (startLndHostError) {
      this.formApi.setError('connectionString', startLndHostError)
    }
    if (startLndCertError) {
      this.formApi.setError('connectionString', startLndCertError)
    }
    if (startLndMacaroonError) {
      this.formApi.setError('connectionString', startLndMacaroonError)
    }

    // Clear connection erros now that we have used them.
    if (startLndHostError || startLndCertError || startLndMacaroonError) {
      clearStartLndError()
    }
  }

  componentDidUpdate(prevProps) {
    const { lndConnect, setLndconnect } = this.props

    // If we have an lndConnect link, populate the form and submit immediately.
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      this.formApi.setValue('connectionString', lndConnect)
      this.formApi.setTouched('connectionString', true)
      this.formApi.submitForm()
      setLndconnect(null)
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleSubmit = values => {
    const { setConnectionString, setName } = this.props
    setConnectionString(values.connectionString)
    setName(values.name)
  }

  render() {
    const {
      wizardApi,
      wizardState,
      connectionString,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      name,
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
          const willValidateInline =
            formState.submits > 0 ||
            connectionString ||
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

              <ConnectionDetailsTabs mb={4} />

              <LndConnectionStringInput
                description={
                  <>
                    <Box mb={2}>
                      <FormattedMessage {...messages.connection_uri_lndconnect_description} />
                    </Box>
                    <Box mb={2}>
                      <FormattedMessage {...messages.connection_options_separator} />
                    </Box>
                    <Box>
                      <FormattedMessage {...messages.connection_uri_btcpay_description} />
                    </Box>
                  </>
                }
                field="connectionString"
                initialValue={connectionString}
                isRequired
                mb={3}
                rows="12"
                validateOnBlur={willValidateInline}
                validateOnChange={willValidateInline}
                willAutoFocus
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

export default injectIntl(ConnectionDetailsString)
