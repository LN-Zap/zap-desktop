import { connect } from 'react-redux'
import { finishLnurlChannel, channelsSelectors, declineLnurlChannel } from 'reducers/channels'
import { LnurlChannelPrompt } from 'components/Channels'

const mapStateToProps = state => ({
  params: channelsSelectors.lnurlChannelParams(state),
})

const mapDispatchToProps = {
  onOk: finishLnurlChannel,
  onCancel: declineLnurlChannel,
}

export default connect(mapStateToProps, mapDispatchToProps)(LnurlChannelPrompt)
