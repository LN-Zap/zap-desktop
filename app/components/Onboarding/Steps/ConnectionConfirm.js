import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import get from 'lodash.get'
import { Bar, Form, Header, Span, Text } from 'components/UI'
import messages from './messages'

const parseConnectionString = value => {
  let config = {}
  try {
    config = JSON.parse(value)
  } catch (e) {
    return new Error('Invalid connection string')
  }
  const configs = get(config, 'configurations', [])
  const params = configs.find(c => c.type === 'grpc' && c.cryptoCode === 'BTC') || {}
  const { host, port, macaroon } = params
  if (!host || !port || !macaroon) {
    return new Error('Invalid connection string')
  }
  return { host, port, macaroon }
}

class ConnectionConfirm extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    connectionType: PropTypes.string.isRequired,
    connectionHost: PropTypes.string,
    connectionCert: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndCertError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    startLnd: PropTypes.func.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool,
    lightningGrpcActive: PropTypes.bool
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
    connectionHost: '',
    connectionCert: '',
    connectionMacaroon: '',
    connectionString: '',
    startLndHostError: '',
    startLndCertError: '',
    startLndMacaroonError: ''
  }

  handleSubmit = async () => {
    let {
      connectionType,
      connectionHost,
      connectionCert,
      connectionMacaroon,
      connectionString,
      startLnd
    } = this.props
    let options = {
      type: connectionType,
      host: connectionHost,
      cert: connectionCert,
      macaroon: connectionMacaroon
    }
    if (connectionString) {
      const { host, port, macaroon } = parseConnectionString(connectionString)
      options = { type: connectionType, host: `${host}:${port}`, macaroon }
    }
    return startLnd(options)
  }

  render() {
    const {
      wizardApi,
      wizardState,
      connectionType,
      connectionHost,
      connectionCert,
      connectionMacaroon,
      connectionString,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      startLnd,
      ...rest
    } = this.props
    const { getApi, preSubmit, onSubmit, onSubmitFailure } = wizardApi

    // Determine the hostname.
    let hostname = connectionHost.split(':')[0]
    if (connectionString) {
      const { host } = parseConnectionString(connectionString)
      hostname = host
    }

    return (
      <Form
        {...rest}
        getApi={getApi}
        preSubmit={preSubmit}
        onSubmit={async values => {
          try {
            await this.handleSubmit(values)
            if (onSubmit) {
              onSubmit(values)
            }
          } catch (e) {
            wizardApi.onSubmitFailure()
            wizardApi.previous()
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        <Header
          title={<FormattedMessage {...messages.confirm_connection_title} />}
          subtitle={<FormattedMessage {...messages.confirm_connection_description} />}
          align="left"
        />

        <Bar my={4} />

        <Text>
          <FormattedMessage {...messages.verify_host_title} />{' '}
          <Span color="superGreen">{hostname}</Span>?{' '}
        </Text>
        <Text mt={2}>
          <FormattedMessage {...messages.verify_host_description} />
        </Text>
      </Form>
    )
  }
}

export default ConnectionConfirm
