import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import { verifyMessage } from 'reducers/lnd'
import ProfilePaneVerifyMessage from 'components/Profile/ProfilePaneVerifyMessage'

const mapDispatchToProps = {
  showNotification,
  verifyMessage,
}

export default connect(
  null,
  mapDispatchToProps
)(ProfilePaneVerifyMessage)
