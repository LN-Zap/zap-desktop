// @flow
import React, { Component } from 'react'
import styles from './Peer.scss'

class Peer extends Component {
  render() {
    const { peer } = this.props
    console.log('peer: ', peer)
    return (
        <li className={styles.peer}>
            <h4>{peer.address}</h4>
            <h1>{peer.pub_key}</h1>
        </li>
    )
  }
}


export default Peer