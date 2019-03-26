import { connect } from 'react-redux'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'
import NodeCardList from 'components/Channels/NodeCardList'

const mapStateToProps = state => ({
  nodes: contactFormSelectors.suggestedNodes(state),
})

const mapDispatchToProps = {
  updateContactFormSearchQuery,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeCardList)
