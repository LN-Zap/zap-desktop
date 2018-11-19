import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import { infoSelectors } from 'reducers/info'
import { lndSelectors } from 'reducers/lnd'
import { setIsWalletOpen } from 'reducers/wallet'

import { Syncing } from 'components/Syncing'
import withLoading from 'components/withLoading'

const mapStateToProps = state => ({
  address: state.address.address,
  hasSynced: infoSelectors.hasSynced(state),
  syncStatus: state.lnd.syncStatus,
  syncPercentage: lndSelectors.syncPercentage(state),
  blockHeight: state.lnd.blockHeight,
  lndBlockHeight: state.lnd.lndBlockHeight,
  lndCfilterHeight: state.lnd.lndCfilterHeight,
  isLoading:
    infoSelectors.infoLoading(state) ||
    state.lnd.syncStatus === 'pending' ||
    !state.lnd.lightningGrpcActive ||
    !state.lnd.blockHeight ||
    !state.lnd.lndBlockHeight
})

const mapDispatchToProps = {
  setIsWalletOpen
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLoading(withTheme(Syncing)))
