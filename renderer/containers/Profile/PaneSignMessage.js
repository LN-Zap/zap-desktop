import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import PaneSignMessage from 'components/Profile/PaneSignMessage'

const mapDispatchToProps = {
  showNotification,
}

export default connect(
  null,
  mapDispatchToProps
)(PaneSignMessage)
