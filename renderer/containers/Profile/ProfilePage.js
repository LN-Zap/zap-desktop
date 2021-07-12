import { connect } from 'react-redux'

import ProfilePage from 'components/Profile/ProfilePage'
import { walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
})

export default connect(mapStateToProps)(ProfilePage)
