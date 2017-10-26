import React from 'react'
import PropTypes from 'prop-types'
import { MdSearch } from 'react-icons/lib/md'
import styles from './StepOne.scss'

const StepOne = ({ peers, changeStep, setNodeKey }) => {
  const peerClicked = (peer) => {
    setNodeKey(peer.pub_key)
    changeStep(2)
  }

  return (
    <div>
      <div className={styles.search}>
        <label className={`${styles.label} ${styles.input}`} htmlFor='peersSearch'>
          <MdSearch />
        </label>
        <input
          value={''}
          onChange={event => console.log('event: ', event)}
          className={`${styles.text} ${styles.input}`}
          placeholder='Search your peers by their public key'
          type='text'
          id='peersSearch'
        />
      </div>

      <ul className={styles.peers}>
        {peers.length &&
          peers.map(peer => (
            <li
              key={peer.peer_id}
              className={styles.peer}
              onClick={() => peerClicked(peer)}
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

StepOne.propTypes = {}

export default StepOne
