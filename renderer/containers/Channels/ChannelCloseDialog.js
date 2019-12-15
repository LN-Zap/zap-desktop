import { connect } from 'react-redux'
import { ChannelCloseDialog } from 'components/Channels'
import { closeChannel, channelsSelectors, CLOSE_CHANNEL_DIALOG_ID } from 'reducers/channels'
import { showNotification } from 'reducers/notification'
import { modalSelectors, closeDialog } from 'reducers/modal'

const isForceCloseDialog = state => {
  const selectedChannel = channelsSelectors.selectedChannel(state)
  return selectedChannel && !selectedChannel.active
}

const csvDelay = state => {
  const selectedChannel = channelsSelectors.selectedChannel(state)
  return selectedChannel && selectedChannel.csv_delay ? selectedChannel.csv_delay : 0
}

const mapStateToProps = state => {
  return {
    isOpen: modalSelectors.isDialogOpen(state, CLOSE_CHANNEL_DIALOG_ID),
    isForceClose: isForceCloseDialog(state),
    csvDelay: csvDelay(state),
  }
}

const mapDispatchToProps = dispatch => ({
  onClose(message) {
    dispatch(closeChannel())
    dispatch(closeDialog(CLOSE_CHANNEL_DIALOG_ID))
    dispatch(showNotification(message))
  },

  onCancel() {
    dispatch(closeDialog(CLOSE_CHANNEL_DIALOG_ID))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelCloseDialog)
