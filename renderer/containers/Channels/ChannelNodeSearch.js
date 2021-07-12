import { connect } from 'react-redux'

import ChannelNodeSearch from 'components/Channels/ChannelNodeSearch'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'

const mapStateToProps = state => ({
  searchQuery: state.contactsform.searchQuery,
  filteredNetworkNodes: contactFormSelectors.filteredNetworkNodes(state),
})

const mapDispatchToProps = {
  updateContactFormSearchQuery,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelNodeSearch)
