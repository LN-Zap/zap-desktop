import { connect } from 'react-redux'

import { Recover } from 'components/Onboarding/Steps'
import { setSeed } from 'reducers/onboarding'

const mapDispatchToProps = {
  setSeed,
}

export default connect(null, mapDispatchToProps)(Recover)
