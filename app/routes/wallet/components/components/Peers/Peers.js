// @flow
import React, { Component } from 'react'
import { TiPlus } from 'react-icons/lib/ti'
import PeerModal from './components/PeerModal'
import PeerForm from './components/PeerForm'
import Peer from './components/Peer'
import styles from './Peers.scss'

class Peers extends Component {
  render() {
    const { 
        peersLoading,
        peers,
        peer,
        setPeer,
        modalPeer,
        peerModalOpen,
        peerForm,
        setPeerForm,
        connect,
        disconnect,
    } = this.props

    return (
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
  }
}

export default Peers
