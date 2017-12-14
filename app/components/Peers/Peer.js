import React from 'react'
import PropTypes from 'prop-types'
import styles from './Peer.scss'

const Peer = ({ peer, setPeer }) => (
  <li className={styles.peer} onClick={() => setPeer(peer)}>
    <h4>{peer.address}</h4>
    <h1>{peer.pub_key}</h1>
  </li>
)

Peer.propTypes = {
  peer: PropTypes.shape({
    address: PropTypes.string.isRequired,
    pub_key: PropTypes.string.isRequired
  }).isRequired,
  setPeer: PropTypes.func.isRequired
}

export default Peer
