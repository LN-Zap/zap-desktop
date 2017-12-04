import React from 'react'
import PropTypes from 'prop-types'
import styles from './PeersList.scss'

const PeersList = ({ peers }) => (
  <ul className={styles.peers}>
    {
      peers.map(peer =>
        <li key={peer.peer_id} className={styles.peer}>
          <span className={styles.dot} />
          <h1>{peer.address}</h1>
          <h4>{peer.pub_key}</h4>
        </li>
      )
    }
  </ul>
)

PeersList.propTypes = {
  peers: PropTypes.array.isRequired
}

export default PeersList
