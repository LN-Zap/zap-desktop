import { connect } from 'react-redux'
import ChannelsMenu from 'components/Channels/ChannelsMenu'
import { openModal } from 'reducers/modal'
import { tickerSelectors } from 'reducers/ticker'
import { balanceSelectors } from 'reducers/balance'
import { channelsSelectors } from 'reducers/channels'

const mapStateToProps = state => ({
  cryptoName: tickerSelectors.cryptoName(state),
  lightningBalance: balanceSelectors.channelBalanceConfirmed(state),
  pendingBalance: balanceSelectors.channelBalancePending(state),
  onchainBalance: balanceSelectors.walletBalance(state),
  channelCount: channelsSelectors.allChannelsCount(state),
})

const mapDispatchToProps = {
  openModal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelsMenu)
