import { connect } from 'react-redux'

import { ChannelDetail } from 'components/Channels'
import { setSelectedChannel, CLOSE_CHANNEL_DIALOG_ID } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { openDialog } from 'reducers/modal'
import { tickerSelectors } from 'reducers/ticker'
import { decoratedSelectedChannel } from 'reducers/utils'

const closeChannel = openDialog.bind(null, CLOSE_CHANNEL_DIALOG_ID)

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  networkInfo: infoSelectors.networkInfo(state),
  channel: decoratedSelectedChannel(state),
})

const mapDispatchToProps = {
  closeChannel,
  setSelectedChannel,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelDetail)
