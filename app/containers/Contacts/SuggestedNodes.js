import { connect } from 'react-redux'
import { openSubmitChannelForm, setNode, contactFormSelectors } from 'reducers/contactsform'
import SuggestedNodes from 'components/Contacts/SuggestedNodes'

const mapStateToProps = state => ({
  suggestedNodesLoading: state.channels.suggestedNodesLoading,
  suggestedNodes: contactFormSelectors.suggestedNodes(state)
})

const mapDispatchToProps = {
  openSubmitChannelForm,
  setNode
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuggestedNodes)
