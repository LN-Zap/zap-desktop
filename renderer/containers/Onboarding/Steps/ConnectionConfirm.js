import { connect } from 'react-redux'

import { ConnectionConfirm } from 'components/Onboarding/Steps'
import { startLnd, lndSelectors } from 'reducers/lnd'

const mapStateToProps = state => ({
  connectionMacaroon: state.onboarding.connectionMacaroon,
  connectionString: state.onboarding.connectionString,
  connectionType: state.onboarding.connectionType,
  connectionHost: state.onboarding.connectionHost,
  connectionCert: state.onboarding.connectionCert,
  isLightningGrpcActive: state.lnd.isLightningGrpcActive,
  isWalletUnlockerGrpcActive: state.lnd.isWalletUnlockerGrpcActive,
  lndConnect: state.onboarding.lndConnect,
  name: state.onboarding.name,
  startLndHostError: lndSelectors.startLndHostError(state),
  startLndCertError: lndSelectors.startLndCertError(state),
  startLndMacaroonError: lndSelectors.startLndMacaroonError(state),
})

const mapDispatchToProps = {
  startLnd,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionConfirm)
