import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import { infoSelectors } from 'reducers/info'
import { walletSelectors } from 'reducers/wallet'
import ProfilePaneNodeInfo from 'components/Profile/ProfilePaneNodeInfo'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  nodeUriOrPubkey: infoSelectors.nodeUriOrPubkey(state),
  lndVersion: infoSelectors.lndVersion(state),
})

const mapDispatchToProps = {
  showNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePaneNodeInfo)
