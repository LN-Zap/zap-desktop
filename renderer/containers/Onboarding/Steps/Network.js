import { connect } from 'react-redux'

import { Network } from 'components/Onboarding/Steps'
import { setNetwork } from 'reducers/onboarding'

const mapStateToProps = state => ({
  network: state.onboarding.network,
})

const mapDispatchToProps = {
  setNetwork,
}

export default connect(mapStateToProps, mapDispatchToProps)(Network)
