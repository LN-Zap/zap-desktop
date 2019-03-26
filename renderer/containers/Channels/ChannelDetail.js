import { connect } from 'react-redux'
import { ChannelDetail } from 'components/Channels'
import { showCloseChannelDialog, setSelectedChannel } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'
import { decoratedSelectedChannel } from 'reducers/utils'

const mapStateToProps = state => ({
  currencyName: tickerSelectors.currencyName(state),
  networkInfo: infoSelectors.networkInfo(state),
  channel: decoratedSelectedChannel(state),
})

const mapDispatchToProps = {
  closeChannel: showCloseChannelDialog,
  setSelectedChannel,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelDetail)
