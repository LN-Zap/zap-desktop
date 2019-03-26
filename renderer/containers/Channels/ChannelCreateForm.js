import { connect } from 'react-redux'
import ChannelCreateForm from 'components/Channels/ChannelCreateForm'
import { tickerSelectors } from 'reducers/ticker'
import { openChannel } from 'reducers/channels'
import { queryFees } from 'reducers/pay'
import { balanceSelectors } from 'reducers/balance'
import { updateContactFormSearchQuery, contactFormSelectors } from 'reducers/contactsform'
import { walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => ({
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  searchQuery: state.contactsform.searchQuery,
  selectedNodeDisplayName: contactFormSelectors.selectedNodeDisplayName(state),
  currency: tickerSelectors.currency(state),
  walletBalance: balanceSelectors.walletBalanceConfirmed(state),
  currencyName: tickerSelectors.currencyName(state),
  isQueryingFees: state.pay.isQueryingFees,
  onchainFees: state.pay.onchainFees,
  isOpeningChannel: state.channels.openingChannel,
})

const mapDispatchToProps = {
  openChannel,
  queryFees,
  updateContactFormSearchQuery,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCreateForm)
