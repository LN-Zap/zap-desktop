import { connect } from 'react-redux'

import { Name } from 'components/Onboarding/Steps'
import { setName } from 'reducers/onboarding'

const mapStateToProps = state => ({
  name: state.onboarding.name,
})

const mapDispatchToProps = {
  setName,
}

export default connect(mapStateToProps, mapDispatchToProps)(Name)
