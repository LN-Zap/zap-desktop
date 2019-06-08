import { connect } from 'react-redux'
import { walletSelectors } from 'reducers/wallet'
import ProfilePage from 'components/Profile/ProfilePage'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
})

export default connect(mapStateToProps)(ProfilePage)
