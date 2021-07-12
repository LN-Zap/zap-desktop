import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import ConnectionDetailsContext from './ConnectionDetailsContext'
import ConnectionDetailsManual from './ConnectionDetailsManual'
import ConnectionDetailsString from './ConnectionDetailsString'
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
    name: PropTypes.string,
    setConnectionCert: PropTypes.func.isRequired,
    setConnectionHost: PropTypes.func.isRequired,
    setConnectionMacaroon: PropTypes.func.isRequired,
    setConnectionString: PropTypes.func.isRequired,
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
      setConnectionCert,
      setConnectionHost,
      setConnectionMacaroon,
      setConnectionString,
      setName,
    } = this.props
    const { formType } = this.state
    if (formType && formType !== prevState.formType && prevState.formType) {
      switch (formType) {
        case FORM_TYPE_CONNECTION_STRING:
          setConnectionCert(null)
          setConnectionHost(null)
          setConnectionMacaroon(null)
          setName(null)
          break

        case FORM_TYPE_MANUAL:
          setConnectionString(null)
          setName(null)
          break

        default:
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
      clearStartLndError,
      connectionCert,
      connectionHost,
      connectionMacaroon,
      connectionString,
      lndConnect,
      name,
      setConnectionCert,
      setConnectionHost,
      setConnectionMacaroon,
      setConnectionString,
      setLndconnect,
      setName,
      startLndCertError,
      startLndHostError,
      startLndMacaroonError,
      validateCert,
      validateHost,
      validateMacaroon,
      wizardApi,
      wizardState,
    } = this.props
    const { formType } = this.state

    if (!formType) {
      return null
    }

    return (
      <Box
        css={`
          visibility: ${lndConnect ? 'hidden' : 'visible'};
        `}
        width={1}
      >
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
              name={name}
              setConnectionString={setConnectionString}
              setLndconnect={setLndconnect}
              setName={setName}
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
              name={name}
              setConnectionCert={setConnectionCert}
              setConnectionHost={setConnectionHost}
              setConnectionMacaroon={setConnectionMacaroon}
              setLndconnect={setLndconnect}
              setName={setName}
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
