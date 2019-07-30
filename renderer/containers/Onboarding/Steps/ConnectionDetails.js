import { connect } from 'react-redux'
import { ConnectionDetails } from 'components/Onboarding/Steps'
import { clearStartLndError, lndSelectors } from 'reducers/lnd'
import {
  validateHost,
  validateCert,
  validateMacaroon,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  setConnectionString,
  setLndconnect,
} from 'reducers/onboarding'

const mapStateToProps = state => ({
  connectionMacaroon: state.onboarding.connectionMacaroon,
  connectionString: state.onboarding.connectionString,
  connectionType: state.onboarding.connectionType,
  connectionHost: state.onboarding.connectionHost,
  connectionCert: state.onboarding.connectionCert,
  lndConnect: state.onboarding.lndConnect,
  startLndHostError: lndSelectors.startLndHostError(state),
  startLndCertError: lndSelectors.startLndCertError(state),
  startLndMacaroonError: lndSelectors.startLndMacaroonError(state),
})

const mapDispatchToProps = {
  validateHost,
  validateCert,
  validateMacaroon,
  setConnectionHost,
  setConnectionCert,
  setConnectionMacaroon,
  setConnectionString,
  setLndconnect,
  clearStartLndError,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionDetails)
