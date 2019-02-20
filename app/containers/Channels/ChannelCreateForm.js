import { connect } from 'react-redux'
import ChannelCreateForm from 'components/Channels/ChannelCreateForm'
import { tickerSelectors } from 'reducers/ticker'
import { openChannel } from 'reducers/channels'
import { queryFees } from 'reducers/pay'
import { updateContactFormSearchQuery } from 'reducers/contactsform'

const mapStateToProps = state => ({
  searchQuery: state.contactsform.searchQuery,
  currency: tickerSelectors.currency(state),
  channelBalance: state.balance.channelBalance,
  currencyName: tickerSelectors.currencyName(state),
  isQueryingFees: state.pay.isQueryingFees,
  onchainFees: state.pay.onchainFees
})

const mapDispatchToProps = {
  openChannel,
  queryFees,
  updateContactFormSearchQuery
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCreateForm)
