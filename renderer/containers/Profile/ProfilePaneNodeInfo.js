import { connect } from 'react-redux'
import { showNotification } from 'reducers/notification'
import { infoSelectors } from 'reducers/info'
import { walletSelectors } from 'reducers/wallet'
import { backupSelectors } from 'reducers/backup'
import ProfilePaneNodeInfo from 'components/Profile/ProfilePaneNodeInfo'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  nodeUrisOrPubkey: infoSelectors.nodeUrisOrPubkey(state),
  versionString: infoSelectors.versionString(state),
  commitString: infoSelectors.commitString(state),
  backupProvider: backupSelectors.providerSelector(state),
})

const mapDispatchToProps = {
  showNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePaneNodeInfo)
