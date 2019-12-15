import { connect } from 'react-redux'
import { finishLnurlWithdrawal, paySelectors, declineLnurlWithdrawal } from 'reducers/pay'
import { LnurlWithdrawalPrompt } from 'components/Pay'

const mapStateToProps = state => ({
  params: paySelectors.lnurlWithdrawParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlWithdrawal,
  onCancel: declineLnurlWithdrawal,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlWithdrawalPrompt)
