import { connect } from 'react-redux'

import { LnurlAuthPrompt } from 'components/Lnurl'
import { finishLnurlAuth, lnurlSelectors, clearLnurlAuth, declineLnurlAuth } from 'reducers/lnurl'

const mapStateToProps = state => ({
  params: lnurlSelectors.lnurlAuthParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlAuth,
  onCancel: declineLnurlAuth,
  onClose: clearLnurlAuth,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlAuthPrompt)
