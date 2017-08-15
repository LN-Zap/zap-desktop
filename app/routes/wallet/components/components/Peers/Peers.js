import React from 'react'
import PropTypes from 'prop-types'
import { TiPlus } from 'react-icons/lib/ti'
import PeerModal from './components/PeerModal'
import PeerForm from './components/PeerForm'
import Peer from './components/Peer'
import styles from './Peers.scss'

const Peers = ({
  peersLoading,
  peers,
  setPeer,
  modalPeer,
  peerModalOpen,
  peerForm,
  setPeerForm,
  connect,
  disconnect
}) => (
  <div className={styles.peers}>
    <PeerModal isOpen={peerModalOpen} resetPeer={setPeer} peer={modalPeer} disconnect={disconnect} />
    <PeerForm form={peerForm} setForm={setPeerForm} connect={connect} />
    <div className={styles.header}>
      <h3>Peers</h3>
      <div
        className={`${styles.connectPeer} hint--top`}
        data-hint='Connect to a peer'
        onClick={() => setPeerForm({ isOpen: true })}
      >
        <TiPlus />  
      </div>
    </div>
    <ul>
      {
        !peersLoading ? 
          peers.map(peer => <Peer key={peer.peer_id} peer={peer} setPeer={setPeer} />)
        :
          'Loading...'
      }
    </ul>
  </div>
)

Peers.propTypes = {
  peersLoading: PropTypes.bool.isRequired,
  peers: PropTypes.array.isRequired,
  setPeer: PropTypes.func.isRequired,
  modalPeer: PropTypes.object,
  peerModalOpen: PropTypes.bool.isRequired,
  peerForm: PropTypes.object.isRequired,
  setPeerForm: PropTypes.func.isRequired,
  connect: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired
}

export default Peers
