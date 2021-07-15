import { connect } from 'react-redux'

import { ChannelCloseDialog } from 'components/Channels'
import { closeChannel, channelsSelectors, CLOSE_CHANNEL_DIALOG_ID } from 'reducers/channels'
import { modalSelectors, closeDialog } from 'reducers/modal'
import { showNotification } from 'reducers/notification'
import { settingsSelectors } from 'reducers/settings'

const isForceCloseDialog = state => {
  const selectedChannel = channelsSelectors.selectedChannel(state)
  return selectedChannel && !selectedChannel.active
}

const csvDelay = state => {
  const selectedChannel = channelsSelectors.selectedChannel(state)
  return selectedChannel && selectedChannel.csvDelay ? selectedChannel.csvDelay : 0
}

const mapStateToProps = state => {
  return {
    isOpen: modalSelectors.isDialogOpen(state, CLOSE_CHANNEL_DIALOG_ID),
    isForceClose: isForceCloseDialog(state),
    lndTargetConfirmations: settingsSelectors.currentConfig(state).lndTargetConfirmations,
    csvDelay: csvDelay(state),
  }
}

const mapDispatchToProps = dispatch => ({
  onClose(targetConf, message) {
    dispatch(closeChannel({ targetConf }))
    dispatch(closeDialog(CLOSE_CHANNEL_DIALOG_ID))
    dispatch(showNotification(message))
  },

  onCancel() {
    dispatch(closeDialog(CLOSE_CHANNEL_DIALOG_ID))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelCloseDialog)
