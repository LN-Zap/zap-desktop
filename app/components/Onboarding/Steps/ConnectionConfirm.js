import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import encode from 'lndconnect/encode'
import decode from 'lndconnect/decode'
import parseConnectionString from 'lib/utils/btcpayserver'
import { Bar, Form, Header, Span, Text } from 'components/UI'
import messages from './messages'

class ConnectionConfirm extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    connectionType: PropTypes.string.isRequired,
    connectionHost: PropTypes.string,
    connectionCert: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    lndConnect: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndCertError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    startLnd: PropTypes.func.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool,
    lightningGrpcActive: PropTypes.bool
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  componentDidUpdate(prevProps) {
    const { wizardApi, lndConnect } = this.props
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      wizardApi.navigateTo(0)
    }
  }

  handleSubmit = async () => {
    let {
      connectionHost,
      connectionCert,
      connectionMacaroon,
      connectionString,
      startLnd
    } = this.props

    // If we have a hostname, assume we are using the custom form in which host, cer and macaroon paths are supplied.
    if (connectionHost) {
      return startLnd({
        type: 'custom',
        decoder: 'lnd.lndconnect.v1',
        lndconnectUri: encode({
          host: connectionHost,
          cert: connectionCert,
          macaroon: connectionMacaroon
        })
      })
    }

    // If its already an lndconnect uri, use it as is.
    if (connectionString.startsWith('lndconnect:')) {
      return startLnd({
        type: 'custom',
        decoder: 'lnd.lndconnect.v1',
        lndconnectUri: connectionString
      })
    }

    // Otherwise, process it as a BtcPayServer connection string.
    const { host, port, macaroon } = parseConnectionString(connectionString)
    return startLnd({
      type: 'custom',
      decoder: 'lnd.lndconnect.v1',
      lndconnectUri: encode({
        host: `${host}:${port}`,
        macaroon
      })
    })
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
      lndConnect,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      startLnd,
      ...rest
    } = this.props
    const { getApi, onSubmit, onSubmitFailure } = wizardApi
    let hostname

    // If we have a hostname, use it as is.
    if (connectionHost) {
      hostname = connectionHost
    }
    // Otherwise, if we have a connection uri, parse the host details from that.
    else if (connectionString) {
      if (connectionString.startsWith('lndconnect:')) {
        const { host } = decode(connectionString)
        hostname = host
      } else {
        const { host } = parseConnectionString(connectionString)
        hostname = host
      }
    }

    return (
      <Form
        {...rest}
        getApi={getApi}
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

        {!hostname && (
          <Text>
            <FormattedMessage {...messages.connection_string_invalid} />
          </Text>
        )}
        {hostname && (
          <>
            <Text>
              <FormattedMessage {...messages.verify_host_title} />{' '}
              <Span color="superGreen">{hostname.split(':')[0]}</Span>?{' '}
            </Text>
            <Text mt={2}>
              <FormattedMessage {...messages.verify_host_description} />
            </Text>
          </>
        )}
      </Form>
    )
  }
}

export default ConnectionConfirm
