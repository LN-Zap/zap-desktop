import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'

import userIcon from 'icons/user.svg'
import { FaUser, FaRepeat } from 'react-icons/lib/fa'
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
      fetchPeers,
      peerFormProps,
      setPeerForm,
      setPeer,
      updateSearchQuery,
      disconnectRequest,

      peerModalOpen,
      filteredPeers,
      peers: { peer, searchQuery },
      info: {  data: { identity_pubkey } }
    } = this.props

    const refreshClicked = event => {
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
          <div className={styles.titleContainer}>
            <div className={styles.left}>
              <div className={styles.identityPubkey}>
                <section className={styles.userIcon}>
                  <Isvg src={userIcon} />
                </section>
                <section>
                  <h4>Your node public key</h4>
                  <h2>{identity_pubkey}</h2>
                </section>
              </div>
            </div>
          </div>
          <div className={styles.addPeerContainer}>
            <div className={`buttonPrimary ${styles.newPeerButton}`} onClick={() => setPeerForm({ isOpen: true })}>
              Add new peer
            </div>
          </div>
        </header>

        <div className={styles.refreshContainer}>
          <span className={`${styles.refresh} hint--left`} data-hint='Refresh your peers list'>
            <FaRepeat
              onClick={refreshClicked}
            />
          </span>
        </div>

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
