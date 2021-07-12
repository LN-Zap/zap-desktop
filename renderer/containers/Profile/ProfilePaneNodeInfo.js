import { connect } from 'react-redux'

import ProfilePaneNodeInfo from 'components/Profile/ProfilePaneNodeInfo'
import { backupSelectors } from 'reducers/backup'
import { infoSelectors } from 'reducers/info'
import { showNotification } from 'reducers/notification'
import { walletSelectors } from 'reducers/wallet'

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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePaneNodeInfo)
