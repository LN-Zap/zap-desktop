import { connect } from 'react-redux'

import { DialogLndCrashed } from 'components/Dialog'
import { neutrinoReset, neutrinoSelectors } from 'reducers/neutrino'

const mapStateToProps = state => ({
  isOpen: neutrinoSelectors.isNeutrinoCrashed(state),
  lndCrashReason: neutrinoSelectors.neutrinoCrashReason(state),
})

const mapDispatchToProps = {
  onCancel: neutrinoReset,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogLndCrashed)
