import { connect } from 'react-redux'

import ChannelsMenu from 'components/Channels/ChannelsMenu'
import { balanceSelectors } from 'reducers/balance'
import { channelsSelectors } from 'reducers/channels'
import { openModal } from 'reducers/modal'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  lightningBalance: balanceSelectors.channelBalanceConfirmed(state),
  pendingBalance: balanceSelectors.pendingBalance(state),
  onchainBalance: balanceSelectors.walletBalance(state),
  channelCount: channelsSelectors.allChannelsCount(state),
})

const mapDispatchToProps = {
  openModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelsMenu)
