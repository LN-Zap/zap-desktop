import { connect } from 'react-redux'

import NodeCardList from 'components/Channels/NodeCardList'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'

const mapStateToProps = state => ({
  nodes: contactFormSelectors.suggestedNodes(state),
})

const mapDispatchToProps = {
  updateContactFormSearchQuery,
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeCardList)
