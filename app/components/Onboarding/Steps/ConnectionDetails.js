import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import ConnectionDetailsManual from './ConnectionDetailsManual'
import ConnectionDetailsString from './ConnectionDetailsString'
import ConnectionDetailsContext from './ConnectionDetailsContext'
import { FORM_TYPE_CONNECTION_STRING, FORM_TYPE_MANUAL } from './constants'

class ConnectionDetails extends React.Component {
  state = {
    formType: null
  }

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
    setConnectionString: PropTypes.func.isRequired,
    clearStartLndError: PropTypes.func.isRequired,
    validateHost: PropTypes.func.isRequired,
    validateCert: PropTypes.func.isRequired,
    validateMacaroon: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { connectionHost, connectionCert, connectionMacaroon } = this.props

    if (connectionHost || connectionCert || connectionMacaroon) {
      this.openModal(FORM_TYPE_MANUAL)
    } else {
      this.openModal(FORM_TYPE_CONNECTION_STRING)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      lndConnect,
      setConnectionHost,
      setConnectionCert,
      setConnectionMacaroon,
      setConnectionString
    } = this.props
    const { formType } = this.state
    if (formType && formType !== prevState.formType && prevState.formType) {
      switch (formType) {
        case FORM_TYPE_CONNECTION_STRING:
          setConnectionHost(null)
          setConnectionCert(null)
          setConnectionMacaroon(null)

          break
        case FORM_TYPE_MANUAL:
          setConnectionString(null)
          break
      }
    }
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      this.openModal(FORM_TYPE_CONNECTION_STRING)
    }
  }

  openModal = formType => {
    this.setState({ formType })
  }

  render() {
    const {
      wizardApi,
      wizardState,
      connectionHost,
      connectionCert,
      connectionMacaroon,
      connectionString,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      lndConnect,
      setLndconnect,
      setConnectionHost,
      setConnectionCert,
      setConnectionMacaroon,
      setConnectionString,
      clearStartLndError,
      validateHost,
      validateCert,
      validateMacaroon
    } = this.props
    const { formType } = this.state

    if (!formType) {
      return null
    }

    return (
      <Box css={{ visibility: lndConnect ? 'hidden' : 'visible' }}>
        <ConnectionDetailsContext.Provider
          value={{
            formType,
            openModal: this.openModal
          }}
        >
          {formType === FORM_TYPE_CONNECTION_STRING ? (
            <ConnectionDetailsString
              wizardApi={wizardApi}
              wizardState={wizardState}
              connectionString={connectionString}
              startLndHostError={startLndHostError}
              startLndCertError={startLndCertError}
              startLndMacaroonError={startLndMacaroonError}
              lndConnect={lndConnect}
              setLndconnect={setLndconnect}
              setConnectionString={setConnectionString}
              clearStartLndError={clearStartLndError}
            />
          ) : (
            <ConnectionDetailsManual
              wizardApi={wizardApi}
              wizardState={wizardState}
              connectionHost={connectionHost}
              connectionCert={connectionCert}
              connectionMacaroon={connectionMacaroon}
              connectionString={connectionString}
              startLndHostError={startLndHostError}
              startLndCertError={startLndCertError}
              startLndMacaroonError={startLndMacaroonError}
              lndConnect={lndConnect}
              setLndconnect={setLndconnect}
              setConnectionHost={setConnectionHost}
              setConnectionCert={setConnectionCert}
              setConnectionMacaroon={setConnectionMacaroon}
              clearStartLndError={clearStartLndError}
              validateHost={validateHost}
              validateCert={validateCert}
              validateMacaroon={validateMacaroon}
            />
          )}
        </ConnectionDetailsContext.Provider>
      </Box>
    )
  }
}

export default ConnectionDetails
