import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import { walletSelectors } from 'reducers/wallet'
import ProfilePaneConnect from 'components/Profile/ProfilePaneConnect'

const mapStateToProps = state => ({
  lndconnectQRCode: walletSelectors.lndconnectQRCode(state),
})

const mapDispatchToProps = {
  showNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePaneConnect)
