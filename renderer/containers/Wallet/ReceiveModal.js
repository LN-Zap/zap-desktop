import { connect } from 'react-redux'
import get from 'lodash/get'
import ReceiveModal from 'components/Wallet/ReceiveModal'
import { addressSelectors, closeWalletModal } from 'reducers/address'
import { walletSelectors } from 'reducers/wallet'
import { tickerSelectors } from 'reducers/ticker'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'

const mapStateToProps = state => ({
  networkInfo: infoSelectors.networkInfo(state),
  chainName: tickerSelectors.cryptoAddressName(state),
  pubkey: get(state.info, 'data.uris[0]') || get(state.info, 'data.identity_pubkey'),
  address: addressSelectors.currentAddress(state),
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
