import { connect } from 'react-redux'
import {
  finishLnurlWithdraw,
  clearLnurlWithdraw,
  declineLnurlWithdraw,
  lnurlSelectors,
} from 'reducers/lnurl'
import { LnurlWithdrawPrompt } from 'components/Lnurl'

const mapStateToProps = state => ({
  params: lnurlSelectors.lnurlWithdrawParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlWithdraw,
  onCancel: declineLnurlWithdraw,
  onClose: clearLnurlWithdraw,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlWithdrawPrompt)
