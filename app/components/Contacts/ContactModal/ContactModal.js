import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { FaCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

import { btc } from 'lib/utils'

import styles from './ContactModal.scss'

const ContactModal = ({
  isOpen,
  channel,
  closeContactModal,
  channelNodes,
  closeChannel,
  closingChannelIds
}) => {
  if (!channel) {
    return <span />
  }

  const customStyles = {
    overlay: {
      cursor: 'pointer',
      overflowY: 'auto'
    },
    content: {
      top: 'auto',
      left: '0',
      right: '0',
      bottom: 'auto',
      width: '40%',
      margin: '50px auto',
      borderRadius: 'none',
      padding: '0'
    }
  }

  const removeClicked = () => {
    closeChannel({
      channel_point: channel.channel_point,
      chan_id: channel.chan_id,
      force: !channel.active
    })
  }

  // the remote node for the channel
  const node = channelNodes.find(node => node.pub_key === channel.remote_pubkey)

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="No Overlay Click Modal"
      ariaHideApp
      shouldCloseOnOverlayClick
      onRequestClose={closeContactModal}
      parentSelector={() => document.body}
      style={customStyles}
    >
      {channel && (
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={`${styles.status} ${channel.active ? styles.online : undefined}`}>
              <FaCircle style={{ verticalAlign: 'top' }} />
              <span>{channel.active ? 'Online' : 'Offline'}</span>
            </div>
            <div className={styles.closeContainer}>
              <span onClick={closeContactModal}>
                <MdClose />
              </span>
            </div>
          </header>

          <section className={styles.title}>
            {node && <h1>{node.alias}</h1>}
            <h2>{channel.remote_pubkey}</h2>
          </section>

          <section className={styles.stats}>
            <div className={styles.pay}>
              <h4>Can Pay</h4>
              <div className={styles.meter}>
                <div
                  className={styles.amount}
                  style={{ width: `${(channel.local_balance / channel.capacity) * 100}%` }}
                />
              </div>
              <span>{btc.satoshisToBtc(channel.local_balance)} BTC</span>
            </div>

            <div className={styles.pay}>
              <h4>Can Receive</h4>
              <div className={styles.meter}>
                <div
                  className={styles.amount}
                  style={{ width: `${(channel.remote_balance / channel.capacity) * 100}%` }}
                />
              </div>
              <span>{btc.satoshisToBtc(channel.remote_balance)} BTC</span>
            </div>

            <div className={styles.sent}>
              <h4>Total Bitcoin Sent</h4>
              <p>{btc.satoshisToBtc(channel.total_satoshis_sent)} BTC</p>
            </div>
            <div className={styles.received}>
              <h4>Total Bitcoin Received</h4>
              <p>{btc.satoshisToBtc(channel.total_satoshis_received)} BTC</p>
            </div>
          </section>

          <footer>
            {closingChannelIds.includes(channel.chan_id) ? (
              <span className={styles.inactive}>
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                </div>
              </span>
            ) : (
              <div onClick={removeClicked}>Remove</div>
            )}
          </footer>
        </div>
      )}
    </ReactModal>
  )
}

ContactModal.propTypes = {
  channel: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  closeContactModal: PropTypes.func.isRequired,
  channelNodes: PropTypes.array.isRequired,
  closeChannel: PropTypes.func.isRequired,
  closingChannelIds: PropTypes.array.isRequired
}

export default ContactModal
