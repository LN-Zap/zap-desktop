import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import { signMessage } from 'reducers/lnd'
import ProfilePaneSignMessage from 'components/Profile/ProfilePaneSignMessage'

const mapDispatchToProps = {
  showNotification,
  signMessage,
}

export default connect(
  null,
  mapDispatchToProps
)(ProfilePaneSignMessage)
