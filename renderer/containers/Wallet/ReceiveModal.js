import { connect } from 'react-redux'
import get from 'lodash.get'
import ReceiveModal from 'components/Wallet/ReceiveModal'
import { walletSelectors } from 'reducers/wallet'
import { tickerSelectors } from 'reducers/ticker'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'
import { closeWalletModal } from 'reducers/address'

const mapStateToProps = state => ({
  networkInfo: infoSelectors.networkInfo(state),
  cryptoName: tickerSelectors.currencyAddressName(state),
  pubkey: get(state.info, 'data.uris[0]') || get(state.info, 'data.identity_pubkey'),
  address: state.address.address,
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  alias: state.info.data.alias,
})

const mapDispatchToProps = {
  onClose: closeWalletModal,
  showNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiveModal)
