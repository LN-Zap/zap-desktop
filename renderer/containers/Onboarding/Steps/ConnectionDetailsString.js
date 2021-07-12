import { connect } from 'react-redux'

import { ConnectionDetailsString } from 'components/Onboarding/Steps'
import { clearStartLndError, lndSelectors } from 'reducers/lnd'
import { setLndconnect } from 'reducers/onboarding'

const mapStateToProps = state => ({
  connectionString: state.onboarding.connectionString,
  lndConnect: state.onboarding.lndConnect,
  startLndHostError: lndSelectors.startLndHostError(state),
  startLndCertError: lndSelectors.startLndCertError(state),
  startLndMacaroonError: lndSelectors.startLndMacaroonError(state),
})

const mapDispatchToProps = {
  setLndconnect,
  clearStartLndError,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionDetailsString)
