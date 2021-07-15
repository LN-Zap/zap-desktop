import { connect } from 'react-redux'

import ChannelCreateForm from 'components/Channels/ChannelCreateForm'
import { balanceSelectors } from 'reducers/balance'
import { openChannel } from 'reducers/channels'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'
import { queryFees, paySelectors } from 'reducers/pay'
import { settingsSelectors } from 'reducers/settings'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  searchQuery: state.contactsform.searchQuery,
  selectedNodeDisplayName: contactFormSelectors.selectedNodeDisplayName(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  walletBalance: balanceSelectors.walletBalanceConfirmed(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingFees: paySelectors.isQueryingFees(state),
  onchainFees: paySelectors.onchainFees(state),
  lndTargetConfirmations: settingsSelectors.currentConfig(state).lndTargetConfirmations,
})

const mapDispatchToProps = {
  fetchTickers,
  openChannel,
  queryFees,
  updateContactFormSearchQuery,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelCreateForm)
