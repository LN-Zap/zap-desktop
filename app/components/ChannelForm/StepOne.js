import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdSearch } from 'react-icons/lib/md'
import styles from './StepOne.scss'

class StepOne extends Component {
  constructor(props) {
    super(props)
    this.state = {
      peers: props.peers,
      searchQuery: ''
    }

    this.onSearchQuery = this.onSearchQuery.bind(this)
    this.peerClicked = this.peerClicked.bind(this)
  }

  onSearchQuery(searchQuery) {
    const peers = this.props.peers.filter(peer => peer.pub_key.includes(searchQuery))

    this.setState({ peers, searchQuery })
  }

  peerClicked(peer) {
    const { setNodeKey, changeStep } = this.props

    setNodeKey(peer.pub_key)
    changeStep(2)
  }

  render() {
    const { peers, searchQuery } = this.state

    return (
      <div>
        <div className={styles.search}>
          <label className={`${styles.label} ${styles.input}`} htmlFor='peersSearch'>
            <MdSearch />
          </label>
          <input
            value={searchQuery}
            onChange={event => this.onSearchQuery(event.target.value)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search your peers by their public key'
            type='text'
            id='peersSearch'
          />
        </div>

        <ul className={styles.peers}>
          {peers.length > 0 &&
            peers.map(peer => (
              <li
                key={peer.peer_id}
                className={styles.peer}
                onClick={() => this.peerClicked(peer)}
              >
                <h4>{peer.address}</h4>
                <h1>{peer.pub_key}</h1>
              </li>
            )
            )}
        </ul>
      </div>
    )
  }
}

StepOne.propTypes = {
  peers: PropTypes.array.isRequired,
  setNodeKey: PropTypes.func.isRequired,
  changeStep: PropTypes.func.isRequired
}

export default StepOne
