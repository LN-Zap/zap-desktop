import { connect } from 'react-redux'

import { Password } from 'components/Onboarding/Steps'
import { setPassword } from 'reducers/onboarding'

const mapDispatchToProps = {
  setPassword,
}

export default connect(null, mapDispatchToProps)(Password)
