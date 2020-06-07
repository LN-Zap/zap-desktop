import { connect } from 'react-redux'
import {
  lnurlSelectors,
  finishLnurlChannel,
  clearLnurlChannel,
  declineLnurlChannel,
} from 'reducers/lnurl'
import { LnurlChannelPrompt } from 'components/Lnurl'

const mapStateToProps = state => ({
  params: lnurlSelectors.lnurlChannelParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlChannel,
  onCancel: declineLnurlChannel,
  onClose: clearLnurlChannel,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlChannelPrompt)
