import { connect } from 'react-redux'
import {
  finishLnurlChannel,
  channelsSelectors,
  clearLnurlChannel,
  declineLnurlChannel,
} from 'reducers/channels'
import { LnurlChannelPrompt } from 'components/Channels'

const mapStateToProps = state => ({
  params: channelsSelectors.lnurlChannelParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlChannel,
  onCancel: declineLnurlChannel,
  onClose: clearLnurlChannel,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlChannelPrompt)
