// @flow
import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styles from './PeerModal.scss'

class PeerModal extends Component {
  render() {
    const disconnectClicked = () => {
      const { peer, disconnect } = this.props

      disconnect({ pubkey: peer.pub_key })
        .then(success => (success ? resetPeer(null) : null))
    }

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
        padding: '40px'
      }
    }

    const { isOpen, resetPeer, peer, disconnect } = this.props

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
        {
          peer ?
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
              <div className={styles.close} onClick={disconnectClicked}>
                <div>Disconnect peer</div>
              </div>
            </div>
            :
            null
        }
      </ReactModal>
    )
  }
}


export default PeerModal
