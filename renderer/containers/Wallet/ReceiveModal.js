import { connect } from 'react-redux'

import ReceiveModal from 'components/Wallet/ReceiveModal'
import { addressSelectors } from 'reducers/address'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'
import { tickerSelectors } from 'reducers/ticker'
import { walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => ({
  networkInfo: infoSelectors.networkInfo(state),
  cryptoAddressName: tickerSelectors.cryptoAddressName(state),
  currentAddress: addressSelectors.currentAddress(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
})

const mapDispatchToProps = {
  showNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveModal)
