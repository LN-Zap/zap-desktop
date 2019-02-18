import { connect } from 'react-redux'
import { ChannelCreateForm } from 'components/Channels'
import { tickerSelectors } from 'reducers/ticker'
import { openChannel } from 'reducers/channels'

const mapStateToProps = state => ({
  currency: tickerSelectors.currency(state),
  channelBalance: state.balance.channelBalance,
  currencyName: tickerSelectors.currencyName(state)
})

const mapDispatchToProps = {
  openChannel
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCreateForm)
