import { connect } from 'react-redux'
import {
  finishLnurlWithdraw,
  paySelectors,
  clearLnurlWithdraw,
  declineLnurlWithdraw,
} from 'reducers/pay'
import { LnurlWithdrawPrompt } from 'components/Pay'

const mapStateToProps = state => ({
  params: paySelectors.lnurlWithdrawParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlWithdraw,
  onCancel: declineLnurlWithdraw,
  onClose: clearLnurlWithdraw,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlWithdrawPrompt)
