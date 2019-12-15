import { connect } from 'react-redux'
import ChannelCreateForm from 'components/Channels/ChannelCreateForm'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { openChannel } from 'reducers/channels'
import { queryFees } from 'reducers/pay'
import { balanceSelectors } from 'reducers/balance'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'
import { walletSelectors } from 'reducers/wallet'
import { settingsSelectors } from 'reducers/settings'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  searchQuery: state.contactsform.searchQuery,
  selectedNodeDisplayName: contactFormSelectors.selectedNodeDisplayName(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  walletBalance: balanceSelectors.walletBalanceConfirmed(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingFees: state.pay.isQueryingFees,
  onchainFees: state.pay.onchainFees,
  lndTargetConfirmations: settingsSelectors.currentConfig(state).lndTargetConfirmations,
})

const mapDispatchToProps = {
  fetchTickers,
  openChannel,
  queryFees,
  updateContactFormSearchQuery,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelCreateForm)
