import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import ProfilePaneVerifyMessage from 'components/Profile/ProfilePaneVerifyMessage'

const mapDispatchToProps = {
  showNotification,
}

export default connect(
  null,
  mapDispatchToProps
)(ProfilePaneVerifyMessage)
