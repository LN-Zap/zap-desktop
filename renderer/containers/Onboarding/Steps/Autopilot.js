import { connect } from 'react-redux'

import { Autopilot } from 'components/Onboarding/Steps'
import { setAutopilot } from 'reducers/onboarding'

const mapStateToProps = state => ({
  autopilot: state.onboarding.autopilot,
})

const mapDispatchToProps = {
  setAutopilot,
}

export default connect(mapStateToProps, mapDispatchToProps)(Autopilot)
