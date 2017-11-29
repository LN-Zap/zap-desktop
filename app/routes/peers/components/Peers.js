import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MdSearch } from 'react-icons/lib/md'

import PeerForm from 'components/Peers/PeerForm'
import PeerModal from 'components/Peers/PeerModal'
import Peer from 'components/Peers/Peer'

import styles from './Peers.scss'

class Peers extends Component {
  componentWillMount() {
    this.props.fetchPeers()
  }

  render() {
    const { 
      peerFormProps,
      setPeerForm,
      setPeer,
      updateSearchQuery,
      disconnectRequest,

      peerModalOpen,
      filteredPeers,
      peers: { peer, searchQuery }
    } = this.props

    return (
      <div>
        <div className={styles.search}>
          <PeerForm {...peerFormProps} />

          <PeerModal isOpen={peerModalOpen} resetPeer={setPeer} peer={peer} disconnect={disconnectRequest} />

          <label className={`${styles.label} ${styles.input}`} htmlFor='channelSearch'>
            <MdSearch />
          </label>
          <input
            value={searchQuery}
            onChange={event => updateSearchQuery(event.target.value)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search peers by their node public key or IP address'
            type='text'
            id='peersSearch'
          />
        </div>

        <header className={styles.header}>
          <div className={styles.addPeerContainer}>
            <div className={`buttonPrimary ${styles.newPeerButton}`} onClick={() => setPeerForm({ isOpen: true })}>
              Add new peer
            </div>
          </div>
        </header>

        <div className={styles.peers}>
          {
            filteredPeers.map(filteredPeer => <Peer key={filteredPeer.peer_id} peer={filteredPeer} setPeer={setPeer} />)
          }
        </div>
      </div>
    )
  }
}

Peers.propTypes = {
  
}

export default Peers
