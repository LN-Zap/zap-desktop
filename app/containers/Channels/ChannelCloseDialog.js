import { connect } from 'react-redux'

import { ChannelCloseDialog } from 'components/Channels'
import { hideCloseChannelDialog, closeChannel, channelsSelectors } from 'reducers/channels'
import { showNotification } from 'reducers/notification'

const isForceCloseDialog = state => {
  const selectedChannel = channelsSelectors.selectedChannel(state)
  return selectedChannel && !selectedChannel.active
}

const csvDelay = state => {
  const selectedChannel = channelsSelectors.selectedChannel(state)
  return selectedChannel ? selectedChannel.csv_delay : 0
}

const mapStateToProps = state => {
  const isOpen = Boolean(state.channels.isCloseDialogOpen)
  return {
    isOpen,
    isForceClose: isForceCloseDialog(state),
    csvDelay: csvDelay(state),
  }
}

const mapDispatchToProps = dispatch => ({
  onClose(message) {
    dispatch(closeChannel())
    dispatch(hideCloseChannelDialog())
    dispatch(showNotification(message))
  },

  onCancel() {
    dispatch(hideCloseChannelDialog())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelCloseDialog)
