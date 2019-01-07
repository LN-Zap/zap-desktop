import { connect } from 'react-redux'
import { closeManualForm, openSubmitChannelForm, setNode } from 'reducers/contactsform'
import ConnectManually from 'components/Contacts/ConnectManually'

const mapDispatchToProps = {
  closeManualForm,
  openSubmitChannelForm,
  setNode
}

export default connect(
  null,
  mapDispatchToProps
)(ConnectManually)
