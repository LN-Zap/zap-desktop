import React from 'react'
import PropTypes from 'prop-types'
import styles from './PeersList.scss'

const PeersList = ({ peers, updateSelectedPeers, selectedPeerPubkeys }) => (
  <ul className={styles.peers}>
    {
      peers.map(peer =>
        <li key={peer.peer_id} className={styles.peer} onClick={() => updateSelectedPeers(peer)}>
          <span className={`${styles.dot} ${selectedPeerPubkeys.includes(peer.pub_key) && styles.active}`} />
          <h1>{peer.address}</h1>
          <h4>{peer.pub_key}</h4>
        </li>
      )
    }
  </ul>
)

PeersList.propTypes = {
  peers: PropTypes.array.isRequired,
  updateSelectedPeers: PropTypes.func.isRequired,
  selectedPeerPubkeys: PropTypes.array.isRequired
}

export default PeersList
