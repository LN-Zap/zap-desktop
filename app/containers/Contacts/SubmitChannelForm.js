import { connect } from 'react-redux'
import {
  closeContactsForm,
  closeSubmitChannelForm,
  contactFormSelectors
} from 'reducers/contactsform'
import { openChannel } from 'reducers/channels'
import SubmitChannelForm from 'components/Contacts/SubmitChannelForm'

const mapStateToProps = state => ({
  cryptoCurrency: state.ticker.currency,
  dupeChanInfo: contactFormSelectors.dupeChanInfo(state),
  node: state.contactsform.node
})

const mapDispatchToProps = {
  closeContactsForm: closeContactsForm,
  closeSubmitChannelForm: closeSubmitChannelForm,
  openChannel: openChannel
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitChannelForm)
