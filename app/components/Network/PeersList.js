import React from 'react'
import PropTypes from 'prop-types'
import styles from './PeersList.scss'

const PeersList = ({ peers }) => (
  <ul>
    {
      peers.map(peer =>
        <li className={styles.peer} key={peer.peer_id}>
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
