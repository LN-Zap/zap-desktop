import { connect } from 'react-redux'
import { finishLnurlAuth, lnurlSelectors, clearLnurlAuth, declineLnurlAuth } from 'reducers/lnurl'
import { LnurlAuthPrompt } from 'components/Lnurl'

const mapStateToProps = state => ({
  params: lnurlSelectors.lnurlAuthParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlAuth,
  onCancel: declineLnurlAuth,
  onClose: clearLnurlAuth,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlAuthPrompt)
