import { connect } from 'react-redux'
import ChannelCreate from 'components/Channels/ChannelCreate'
import { closeModal } from 'reducers/modal'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'

const onSubmit = () => closeModal()

const mapStateToProps = state => ({
  searchQuery: state.contactsform.searchQuery,
  isSearchValidNodeAddress: contactFormSelectors.isSearchValidNodeAddress(state),
})

const mapDispatchToProps = {
  updateContactFormSearchQuery,
  onSubmit,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCreate)
