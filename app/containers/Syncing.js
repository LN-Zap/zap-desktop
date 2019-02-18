import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import { infoSelectors } from 'reducers/info'
import { lndSelectors } from 'reducers/lnd'
import { setIsWalletOpen } from 'reducers/wallet'
import { showNotification } from 'reducers/notification'
import { Syncing } from 'components/Syncing'

const mapStateToProps = state => ({
  address: state.address.address,
  hasSynced: infoSelectors.hasSynced(state),
  syncStatus: state.lnd.syncStatus,
  syncPercentage: lndSelectors.syncPercentage(state),
  blockHeight: state.lnd.blockHeight,
  lndBlockHeight: state.lnd.lndBlockHeight,
  lndCfilterHeight: state.lnd.lndCfilterHeight,
  lightningGrpcActive: state.lnd.lightningGrpcActive
})

const mapDispatchToProps = {
  setIsWalletOpen,
  showNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Syncing))
