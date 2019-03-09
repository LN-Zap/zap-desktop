import { connect } from 'react-redux'
import ChannelCreate from 'components/Channels/ChannelCreate'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'

const mapStateToProps = state => ({
  searchQuery: state.contactsform.searchQuery,
  isSearchValidNodeAddress: contactFormSelectors.isSearchValidNodeAddress(state),
})

const mapDispatchToProps = {
  updateContactFormSearchQuery,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCreate)
