import { connect } from 'react-redux'

import { ChannelCloseDialog } from 'components/Channels'
import { hideCloseChannelDialog, closeChannel, channelsSelectors } from 'reducers/channels'

const isForceCloseDialog = state => {
  const selectedChannel = channelsSelectors.selectedChannel(state)
  return selectedChannel && !selectedChannel.active
}
const mapStateToProps = state => {
  const isOpen = Boolean(state.channels.isCloseDialogOpen)
  return {
    isOpen,
    isForceClose: isForceCloseDialog(state)
  }
}

const mapDispatchToProps = dispatch => ({
  onClose() {
    dispatch(closeChannel())
    dispatch(hideCloseChannelDialog())
  },

  onCancel() {
    dispatch(hideCloseChannelDialog())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCloseDialog)
