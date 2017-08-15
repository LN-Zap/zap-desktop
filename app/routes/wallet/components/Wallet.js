import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSVG from 'react-svg'
import Peers from './components/Peers'
import Channels from './components/Channels'
import styles from './Wallet.scss'

class Wallet extends Component {
  componentWillMount() {
    const { fetchInfo, fetchPeers, fetchChannels } = this.props

    fetchInfo()
    fetchPeers()
    fetchChannels()
  }

  render() {
    const {
      info,
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
      openChannel
    } = this.props

    return (
      <div className={styles.wallet}>
        <section className={styles.header}>
          <ReactSVG path='../resources/zap_2.svg' />
          <h1>{info.data.identity_pubkey}</h1>
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
  fetchChannels: PropTypes.func.isRequired
}


export default Wallet
