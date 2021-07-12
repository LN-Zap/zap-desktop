import { connect } from 'react-redux'

import { SeedConfirm } from 'components/Onboarding/Steps'

const mapStateToProps = state => ({
  seed: state.onboarding.seed,
})

export default connect(
  mapStateToProps,
  {} // avoid passing dispatch
)(SeedConfirm)
