import { connect } from 'react-redux'
import { ConnectionType } from 'components/Onboarding/Steps'
import { setConnectionType, resetOnboarding } from 'reducers/onboarding'
import { stopLnd } from 'reducers/lnd'

const mapStateToProps = state => ({
  lndConnect: state.onboarding.lndConnect,
  connectionType: state.onboarding.connectionType,
})

const mapDispatchToProps = {
  stopLnd,
  setConnectionType,
  resetOnboarding,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionType)
