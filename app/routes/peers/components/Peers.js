import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaRepeat } from 'react-icons/lib/fa'
import { MdSearch } from 'react-icons/lib/md'

import PeerForm from 'components/Peers/PeerForm'
import PeerModal from 'components/Peers/PeerModal'
import Peer from 'components/Peers/Peer'

import styles from './Peers.scss'

class Peers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

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
      peers: { peer, searchQuery }
    } = this.props

    const refreshClicked = () => {
      // turn the spinner on
      this.setState({ refreshing: true })

      // store event in icon so we dont get an error when react clears it
      const icon = this.refs.repeat.childNodes

      // fetch peers
      fetchPeers()

      // wait for the svg to appear as child
      const svgTimeout = setTimeout(() => {
        if (icon[0].tagName === 'svg') {
          // spin icon for 1 sec
          icon[0].style.animation = 'spin 1000ms linear 1'
          clearTimeout(svgTimeout)
        }
      }, 1)

      // clear animation after the second so we can reuse it
      const refreshTimeout = setTimeout(() => {
        icon[0].style.animation = ''
        this.setState({ refreshing: false })
        clearTimeout(refreshTimeout)
      }, 1000)
    }

    return (
      <div>
        <PeerForm {...peerFormProps} />

        <PeerModal isOpen={peerModalOpen} resetPeer={setPeer} peer={peer} disconnect={disconnectRequest} />

        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.left}>
              <h1>Peers</h1>
            </div>
          </div>
          <div className={styles.addPeerContainer}>
            <div className={`buttonPrimary ${styles.newPeerButton}`} onClick={() => setPeerForm({ isOpen: true })}>
              Add new peer
            </div>
          </div>
        </header>

        <div className={styles.search}>
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

        <div className={styles.refreshContainer}>
          <span className={styles.refresh} onClick={refreshClicked} ref='repeat'>
            {
              this.state.refreshing ?
                <FaRepeat />
                :
                'Refresh'
            }
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
  fetchPeers: PropTypes.func.isRequired,
  peerFormProps: PropTypes.object.isRequired,
  setPeerForm: PropTypes.func.isRequired,
  setPeer: PropTypes.func.isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
  disconnectRequest: PropTypes.func.isRequired,

  peerModalOpen: PropTypes.bool.isRequired,
  filteredPeers: PropTypes.array.isRequired,
  peers: PropTypes.object.isRequired,
  peer: PropTypes.object,
  searchQuery: PropTypes.string
}

export default Peers
