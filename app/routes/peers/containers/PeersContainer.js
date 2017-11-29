import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { 
  fetchPeers,
  setPeer,
  peersSelectors,
  setPeerForm,
  connectRequest,
  disconnectRequest
} from 'reducers/peers'

import Peers from '../components/Peers'

const mapDispatchToProps = {
  fetchPeers,
  setPeer,
  peersSelectors,
  setPeerForm,
  connectRequest,
  disconnectRequest
}

const mapStateToProps = state => ({
  peers: state.peers
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const peerFormProps = {
    setForm: dispatchProps.setPeerForm,
    connect: dispatchProps.connectRequest,

    form: stateProps.peers.peerForm
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    peerFormProps
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Peers))
