// @flow
import React, { Component } from 'react'
import { TiPlus } from 'react-icons/lib/ti'
import Peer from './components/Peer'
import styles from './Peers.scss'

class Peers extends Component {
  render() {
    const { peersLoading, peers } = this.props
    return (
        <div className={styles.peers}>
            <div className={styles.header}>
                <h3>Peers</h3>
                <div
                    className={`${styles.connectPeer} hint--top`}
                    data-hint='Connect to a peer'
                >
                    <TiPlus />  
                </div>
            </div>
            <ul>
                {
                    !peersLoading && peers.length ? 
                        peers.map(peer => <Peer key={peer.peer_id} peer={peer} />)
                    :
                        'Loading...'
                }
            </ul>
        </div>
    )
  }
}


export default Peers