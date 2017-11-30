import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchPeers,
  setPeer,
  setPeerForm,
  connectRequest,
  disconnectRequest,
  updateSearchQuery,

  peersSelectors
} from 'reducers/peers'

import Peers from '../components/Peers'

const mapDispatchToProps = {
  fetchPeers,
  setPeer,
  peersSelectors,
  setPeerForm,
  connectRequest,
  disconnectRequest,
  updateSearchQuery
}

const mapStateToProps = state => ({
  peers: state.peers,
  info: state.info,

  peerModalOpen: peersSelectors.peerModalOpen(state),
  filteredPeers: peersSelectors.filteredPeers(state)
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
