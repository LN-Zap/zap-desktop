import { connect } from 'react-redux'

import { DialogLndCrashed } from 'components/Dialog'
import { lndReset, lndSelectors } from 'reducers/lnd'

const mapStateToProps = state => ({
  isOpen: lndSelectors.isLndCrashed(state),
  lndCrashReason: lndSelectors.lndCrashReason(state),
})

const mapDispatchToProps = {
  onCancel: lndReset,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogLndCrashed)
