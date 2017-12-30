import React from 'react'
import PropTypes from 'prop-types'

import ReactModal from 'react-modal'
import { FaClose } from 'react-icons/lib/fa'

import styles from './PeerModal.scss'

const PeerModal = ({ isOpen, resetPeer, peer, disconnect }) => {
  const customStyles = {
    overlay: {
      cursor: 'pointer',
      overflowY: 'auto'
    },
    content: {
      top: 'auto',
      left: '20%',
      right: '0',
      bottom: 'auto',
      width: '40%',
      margin: '50px auto',
      borderRadius: 'none',
      padding: '0'
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel='No Overlay Click Modal'
      ariaHideApp
      shouldCloseOnOverlayClick
      onRequestClose={() => resetPeer(null)}
      parentSelector={() => document.body}
      style={customStyles}
    >
      <div className={styles.closeContainer}>
        <span onClick={() => resetPeer(null)}>
          <FaClose />
        </span>
      </div>
      {
        peer &&
        <div className={styles.peer}>
          <header className={styles.header}>
            <h1 data-hint='Peer address' className='hint--top-left'>{peer.address}</h1>
            <h2 data-hint='Peer public key' className='hint--top-left'>{peer.pub_key}</h2>
          </header>

          <div className={styles.details}>
            <dl>
              <dt>Satoshis Received</dt>
              <dd>{peer.sat_recv}</dd>
              <dt>Satoshis Sent</dt>
              <dd>{peer.sat_sent}</dd>
              <dt>Bytes Received</dt>
              <dd>{peer.bytes_recv}</dd>
              <dt>Bytes Sent</dt>
              <dd>{peer.bytes_sent}</dd>
            </dl>
          </div>
          <div className={styles.close} onClick={() => disconnect({ pubkey: peer.pub_key })}>
            <div>Disconnect peer</div>
          </div>
        </div>
      }
    </ReactModal>
  )
}

PeerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  resetPeer: PropTypes.func.isRequired,
  peer: PropTypes.object,
  disconnect: PropTypes.func.isRequired
}

export default PeerModal
