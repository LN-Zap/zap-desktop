import { connect } from 'react-redux'

import ProfilePaneSignMessage from 'components/Profile/ProfilePaneSignMessage'
import { signMessage } from 'reducers/lnd'
import { showNotification } from 'reducers/notification'

const mapDispatchToProps = {
  showNotification,
  signMessage,
}

export default connect(null, mapDispatchToProps)(ProfilePaneSignMessage)
