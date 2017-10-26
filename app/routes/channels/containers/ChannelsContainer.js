import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchChannels,
} from 'reducers/channels'

import Channels from '../components/Channels'

const mapDispatchToProps = {
  fetchChannels
}

const mapStateToProps = state => ({
  channels: state.channels
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Channels))
