import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { MdSearch } from 'react-icons/lib/md'

import PeerForm from 'components/Peers/PeerForm'

import styles from './Peers.scss'

class Peers extends Component {
  render() {
    const { 
      peerFormProps,
      setPeerForm,
      peers: { peers }
    } = this.props
    console.log('props: ', this.props)

    return (
      <div>
        <div className={styles.search}>
          <PeerForm {...peerFormProps} />

          <label className={`${styles.label} ${styles.input}`} htmlFor='channelSearch'>
            <MdSearch />
          </label>
          <input
            value={''}
            onChange={event => console.log('event: ', event)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search peers by their node public key'
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

        </div>
      </div>
    )
  }
}

Peers.propTypes = {
  
}

export default Peers
