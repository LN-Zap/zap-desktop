import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSVG from 'react-svg'
import Peers from './components/Peers'
import Channels from './components/Channels'
import styles from './Wallet.scss'

class Wallet extends Component {
  componentWillMount() {
    const { fetchInfo, fetchPeers, fetchChannels, newAddress } = this.props

    fetchInfo()
    fetchPeers()
    fetchChannels()
    newAddress('p2pkh')
  }

  render() {
    const {
      info,
      address: { addressLoading, address },
      ticker,
      peers: { peersLoading, peers, peer, peerForm },
      channels: { channelsLoading, channels, channel, channelForm, pendingChannels },
      setPeer,
      setChannel,
      peerModalOpen,
      channelModalOpen,
      setPeerForm,
      setChannelForm,
      connectRequest,
      disconnectRequest,
      allChannels,
      openChannel,
      newAddress
    } = this.props

    return (
      <div className={styles.wallet}>
        <section className={styles.header}>
          <section className={styles.walletInfo}>
            <ReactSVG path='../resources/zap_2.svg' />
            <h1>{info.data.identity_pubkey}</h1>
            <section className={styles.addressContainer}>
              <span className={`${styles.addressButton} ${styles.newAddress}`}>New wallet address</span>
              <div className={styles.addressOptions}>
                <span className={`${styles.addressButton} ${styles.p2wkh}`}>p2wkh</span>
                <span className={`${styles.addressButton} ${styles.np2wkh}`}>np2wkh</span>
                <span className={`${styles.addressButton} ${styles.p2pkh}`}>p2pkh</span>
              </div>
              <div className={styles.address}>{address}</div>
            </section>
          </section>
        </section>
        <section className={styles.walletData}>
          <Peers
            peersLoading={peersLoading}
            peers={peers}
            modalPeer={peer}
            setPeer={setPeer}
            peerModalOpen={peerModalOpen}
            peerForm={peerForm}
            setPeerForm={setPeerForm}
            connect={connectRequest}
            disconnect={disconnectRequest}
          />
          <Channels
            ticker={ticker}
            peers={peers}
            channelsLoading={channelsLoading}
            allChannels={allChannels}
            channels={channels}
            pendingChannels={pendingChannels}
            modalChannel={channel}
            setChannel={setChannel}
            channelModalOpen={channelModalOpen}
            channelForm={channelForm}
            setChannelForm={setChannelForm}
            openChannel={openChannel}
          />
        </section>
      </div>
    )
  }
}

Wallet.propTypes = {
  fetchInfo: PropTypes.func.isRequired,
  fetchPeers: PropTypes.func.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  peers: PropTypes.object.isRequired,
  channels: PropTypes.object.isRequired,
  setPeer: PropTypes.func.isRequired,
  setChannel: PropTypes.func.isRequired,
  peerModalOpen: PropTypes.bool.isRequired,
  channelModalOpen: PropTypes.bool.isRequired,
  setPeerForm: PropTypes.func.isRequired,
  setChannelForm: PropTypes.func.isRequired,
  connectRequest: PropTypes.func.isRequired,
  disconnectRequest: PropTypes.func.isRequired,
  allChannels: PropTypes.array.isRequired,
  openChannel: PropTypes.func.isRequired
}


export default Wallet
