import React from 'react'
import PropTypes from 'prop-types'
import { TiPlus } from 'react-icons/lib/ti'
import { FaRepeat } from 'react-icons/lib/fa'
import PeerModal from './PeerModal'
import PeerForm from './PeerForm'
import Peer from './Peer'
import styles from './Peers.scss'

const Peers = ({
  fetchPeers,
  peersLoading,
  peers,
  setPeer,
  modalPeer,
  peerModalOpen,
  peerForm,
  setPeerForm,
  connect,
  disconnect
}) => {
  const refreshClicked = (event) => {
    // store event in icon so we dont get an error when react clears it
    const icon = event.currentTarget

    // fetch peers
    fetchPeers()

    // clear animation after the second so we can reuse it
    setTimeout(() => { icon.style.animation = '' }, 1000)

    // spin icon for 1 sec
    icon.style.animation = 'spin 1000ms linear 1'
  }

  return (
    <div className={styles.peers}>
      <PeerModal isOpen={peerModalOpen} resetPeer={setPeer} peer={modalPeer} disconnect={disconnect} />
      <PeerForm form={peerForm} setForm={setPeerForm} connect={connect} />
      <div className={styles.header}>
        <h3>Peers</h3>
        <span
          className={`${styles.refresh} hint--top`}
          data-hint='Refresh your peers list'

        >
          <FaRepeat
            style={{ verticalAlign: 'baseline' }}
            onClick={refreshClicked}
          />
        </span>
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
}

Peers.propTypes = {
  fetchPeers: PropTypes.func.isRequired,
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
