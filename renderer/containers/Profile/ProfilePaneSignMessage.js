import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import ProfilePaneSignMessage from 'components/Profile/ProfilePaneSignMessage'

const mapDispatchToProps = {
  showNotification,
}

export default connect(
  null,
  mapDispatchToProps
)(ProfilePaneSignMessage)
