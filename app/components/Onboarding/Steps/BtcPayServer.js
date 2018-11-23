import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import get from 'lodash.get'
import { Bar, Form, Header, TextArea } from 'components/UI'
import messages from './messages'

class BtcPayServer extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    connectionString: PropTypes.string.isRequired,
    setConnectionString: PropTypes.func.isRequired,
    startLndHostError: PropTypes.string
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  componentDidUpdate(prevProps) {
    const { startLndHostError } = this.props
    if (startLndHostError && startLndHostError !== prevProps.startLndHostError) {
      this.formApi.setError('connectionString', startLndHostError)
    }
  }

  handleSubmit = values => {
    const { setConnectionString } = this.props
    setConnectionString(values.connectionString)
  }

  handleConnectionStringChange = () => {
    this.formApi.setError('connectionString', null)
  }

  validateConnectionString = value => {
    const { intl } = this.props
    let config = {}
    try {
      config = JSON.parse(value)
    } catch (e) {
      return intl.formatMessage({ ...messages.btcpay_error })
    }
    const configs = get(config, 'configurations', [])
    const params = configs.find(c => c.type === 'grpc' && c.cryptoCode === 'BTC') || {}
    const { host, port, macaroon } = params
    if (!host || !port || !macaroon) {
      return intl.formatMessage({ ...messages.btcpay_error })
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const {
      wizardApi,
      wizardState,
      intl,
      connectionString,
      setConnectionString,
      startLndHostError,
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
          const shouldValidateInline = formState.submits > 0
          return (
            <>
              <Header
                title={<FormattedMessage {...messages.btcpay_page_title} />}
                subtitle={<FormattedMessage {...messages.btcpay_page_description} />}
                align="left"
              />

              <Bar my={4} />

              <TextArea
                autoFocus
                field="connectionString"
                name="connectionString"
                label={<FormattedMessage {...messages.connection_string_label} />}
                description={
                  <FormattedMessage {...messages.btcpay_connection_string_description} />
                }
                placeholder={intl.formatMessage({ ...messages.connection_string_placeholder })}
                initialValue={connectionString}
                onValueChange={this.handleConnectionStringChange}
                validate={this.validateConnectionString}
                validateOnBlur={shouldValidateInline}
                validateOnChange={shouldValidateInline}
                required
                rows="10"
              />
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(BtcPayServer)
