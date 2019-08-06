import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import PaneVerifyMessage from 'components/Profile/PaneVerifyMessage'

const mapDispatchToProps = {
  showNotification,
}

export default connect(
  null,
  mapDispatchToProps
)(PaneVerifyMessage)
