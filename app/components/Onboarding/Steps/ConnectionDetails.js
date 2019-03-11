import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import ConnectionDetailsManual from './ConnectionDetailsManual'
import ConnectionDetailsString from './ConnectionDetailsString'
import ConnectionDetailsContext from './ConnectionDetailsContext'
import { FORM_TYPE_CONNECTION_STRING, FORM_TYPE_MANUAL } from './constants'

class ConnectionDetails extends React.Component {
  state = {
    formType: null,
  }

  static propTypes = {
    clearStartLndError: PropTypes.func.isRequired,
    connectionCert: PropTypes.string,
    connectionHost: PropTypes.string,
    connectionMacaroon: PropTypes.string,
    connectionString: PropTypes.string,
    lndConnect: PropTypes.string,
    setConnectionCert: PropTypes.func.isRequired,
    setConnectionHost: PropTypes.func.isRequired,
    setConnectionMacaroon: PropTypes.func.isRequired,
    setConnectionString: PropTypes.func.isRequired,
    setLndconnect: PropTypes.func.isRequired,
    startLndCertError: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    validateCert: PropTypes.func.isRequired,
    validateHost: PropTypes.func.isRequired,
    validateMacaroon: PropTypes.func.isRequired,
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
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
      setConnectionString,
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
      validateMacaroon,
    } = this.props
    const { formType } = this.state

    if (!formType) {
      return null
    }

    return (
      <Box css={{ visibility: lndConnect ? 'hidden' : 'visible', width: '100%' }}>
        <ConnectionDetailsContext.Provider
          value={{
            formType,
            openModal: this.openModal,
          }}
        >
          {formType === FORM_TYPE_CONNECTION_STRING ? (
            <ConnectionDetailsString
              clearStartLndError={clearStartLndError}
              connectionString={connectionString}
              lndConnect={lndConnect}
              setConnectionString={setConnectionString}
              setLndconnect={setLndconnect}
              startLndCertError={startLndCertError}
              startLndHostError={startLndHostError}
              startLndMacaroonError={startLndMacaroonError}
              wizardApi={wizardApi}
              wizardState={wizardState}
            />
          ) : (
            <ConnectionDetailsManual
              clearStartLndError={clearStartLndError}
              connectionCert={connectionCert}
              connectionHost={connectionHost}
              connectionMacaroon={connectionMacaroon}
              connectionString={connectionString}
              lndConnect={lndConnect}
              setConnectionCert={setConnectionCert}
              setConnectionHost={setConnectionHost}
              setConnectionMacaroon={setConnectionMacaroon}
              setLndconnect={setLndconnect}
              startLndCertError={startLndCertError}
              startLndHostError={startLndHostError}
              startLndMacaroonError={startLndMacaroonError}
              validateCert={validateCert}
              validateHost={validateHost}
              validateMacaroon={validateMacaroon}
              wizardApi={wizardApi}
              wizardState={wizardState}
            />
          )}
        </ConnectionDetailsContext.Provider>
      </Box>
    )
  }
}

export default ConnectionDetails
