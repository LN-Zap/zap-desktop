import React from 'react'

import decode from 'lndconnect/decode'
import encode from 'lndconnect/encode'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import parseConnectionString from '@zap/utils/btcpayserver'
import { Form } from 'components/Form'
import { Bar, Header, Span, Text } from 'components/UI'

import messages from './messages'

class ConnectionConfirm extends React.Component {
  static propTypes = {
    connectionCert: PropTypes.string,
    connectionHost: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    connectionType: PropTypes.string.isRequired,
    isLightningGrpcActive: PropTypes.bool,
    isWalletUnlockerGrpcActive: PropTypes.bool,
    lndConnect: PropTypes.string,
    name: PropTypes.string,
    startLnd: PropTypes.func.isRequired,
    startLndCertError: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {},
  }

  componentDidUpdate(prevProps) {
    const { wizardApi, lndConnect } = this.props
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      wizardApi.navigateTo(0)
    }
  }

  handleSubmit = async () => {
    const {
      connectionCert,
      connectionHost,
      connectionMacaroon,
      connectionString,
      name,
      startLnd,
    } = this.props
    const cleanConnectionString = connectionString && connectionString.trim()
    // If we have a hostname, assume we are using the custom form in which host, cer and macaroon paths are supplied.
    if (connectionHost) {
      return startLnd({
        type: 'custom',
        decoder: 'lnd.lndconnect.v1',
        lndconnectUri: encode({
          host: connectionHost,
          cert: connectionCert,
          macaroon: connectionMacaroon,
        }),
        name,
      })
    }

    // If its already an lndconnect uri, use it as is.
    if (cleanConnectionString.startsWith('lndconnect:')) {
      // In order to support legacy style lndconnect links we first pass the connection string through
      // lndconnect.decode (which supports legacy style links where the host is provided as a querystring). Then encode
      // the result. This ensures that we always store the link the current lndconnect format (with the host part in the
      // origin position).
      //
      // eg. legacy lndconnect format:
      // lndconnect:?cert=~/.lnd/tls.cert&macaroon=~/.lnd/admin.macaroon&host=example.com:10009
      //
      // eg. current lndconnect format:
      // lndconnect://example.com:10009?cert=~/.lnd/tls.cert&macaroon=~/.lnd/admin.macaroon
      const lndconnectUri = encode(decode(cleanConnectionString))

      return startLnd({
        type: 'custom',
        decoder: 'lnd.lndconnect.v1',
        lndconnectUri,
        name,
      })
    }

    // Otherwise, process it as a BtcPayServer connection string.
    const { host, port, macaroon, cert } = parseConnectionString(cleanConnectionString)
    const lndconnectUri = encode({
      host: `${host}:${port}`,
      macaroon,
      cert,
    })

    return startLnd({
      type: 'custom',
      decoder: 'lnd.lndconnect.v1',
      lndconnectUri,
      name,
    })
  }

  render() {
    const {
      wizardApi,
      connectionHost,
      connectionString,
      isLightningGrpcActive,
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
      const conString = connectionString.trim()
      if (conString.startsWith('lndconnect:')) {
        const { host } = decode(conString)
        hostname = host
      } else {
        const { host } = parseConnectionString(conString)
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
            if (onSubmit && !isLightningGrpcActive) {
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
          subtitle={<FormattedMessage {...messages.confirm_connection_description} />}
          title={<FormattedMessage {...messages.confirm_connection_title} />}
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
              <FormattedMessage
                {...messages.verify_host_title}
                values={{
                  hostname: (
                    <Span color="superGreen">{window.Zap.splitHostname(hostname).host}</Span>
                  ),
                }}
              />
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
