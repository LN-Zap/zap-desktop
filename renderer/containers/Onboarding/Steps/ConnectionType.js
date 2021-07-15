import { connect } from 'react-redux'

import { ConnectionType } from 'components/Onboarding/Steps'
import { stopLnd } from 'reducers/lnd'
import { setConnectionType, resetOnboarding } from 'reducers/onboarding'

const mapStateToProps = state => ({
  lndConnect: state.onboarding.lndConnect,
  connectionType: state.onboarding.connectionType,
})

const mapDispatchToProps = {
  stopLnd,
  setConnectionType,
  resetOnboarding,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionType)
