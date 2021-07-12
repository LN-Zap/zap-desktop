import { connect } from 'react-redux'

import { LnurlChannelPrompt } from 'components/Lnurl'
import {
  lnurlSelectors,
  finishLnurlChannel,
  clearLnurlChannel,
  declineLnurlChannel,
} from 'reducers/lnurl'

const mapStateToProps = state => ({
  params: lnurlSelectors.lnurlChannelParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlChannel,
  onCancel: declineLnurlChannel,
  onClose: clearLnurlChannel,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlChannelPrompt)
