import { connect } from 'react-redux'
import { Recover } from 'components/Onboarding/Steps'
import { setSeed } from 'reducers/onboarding'

const mapStateToProps = state => ({
  seed: state.onboarding.seed,
})

const mapDispatchToProps = {
  setSeed,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recover)
