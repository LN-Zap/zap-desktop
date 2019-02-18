import { connect } from 'react-redux'
import { ChannelCreateForm } from 'components/Channels'
import { tickerSelectors } from 'reducers/ticker'
import { openChannel } from 'reducers/channels'
import { queryFees } from 'reducers/pay'

const mapStateToProps = state => ({
  currency: tickerSelectors.currency(state),
  channelBalance: state.balance.channelBalance,
  currencyName: tickerSelectors.currencyName(state),
  isQueryingFees: state.pay.isQueryingFees,
  onchainFees: state.pay.onchainFees
})

const mapDispatchToProps = {
  openChannel,
  queryFees
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCreateForm)
