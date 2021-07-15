import { connect } from 'react-redux'

import ProfilePaneVerifyMessage from 'components/Profile/ProfilePaneVerifyMessage'
import { verifyMessage } from 'reducers/lnd'
import { showNotification } from 'reducers/notification'

const mapDispatchToProps = {
  showNotification,
  verifyMessage,
}

export default connect(null, mapDispatchToProps)(ProfilePaneVerifyMessage)
