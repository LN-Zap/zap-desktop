import { connect } from 'react-redux'

import ProfilePaneConnect from 'components/Profile/ProfilePaneConnect'
import { showNotification } from 'reducers/notification'
import { walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => ({
  lndconnectQRCode: walletSelectors.lndconnectQRCode(state),
})

const mapDispatchToProps = {
  showNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePaneConnect)
