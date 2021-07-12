import { connect } from 'react-redux'

import { SeedView } from 'components/Onboarding/Steps'
import { fetchSeed } from 'reducers/lnd'

const mapStateToProps = state => ({
  seed: state.onboarding.seed,
  isFetchingSeed: state.lnd.isFetchingSeed,
})

const mapDispatchToProps = {
  fetchSeed,
}

export default connect(mapStateToProps, mapDispatchToProps)(SeedView)
