import { connect } from 'react-redux'

import { LnurlWithdrawPrompt } from 'components/Lnurl'
import {
  finishLnurlWithdraw,
  clearLnurlWithdraw,
  declineLnurlWithdraw,
  lnurlSelectors,
} from 'reducers/lnurl'

const mapStateToProps = state => ({
  params: lnurlSelectors.lnurlWithdrawParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlWithdraw,
  onCancel: declineLnurlWithdraw,
  onClose: clearLnurlWithdraw,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlWithdrawPrompt)
