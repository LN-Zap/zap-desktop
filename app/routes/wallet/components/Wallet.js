import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSVG from 'react-svg'
import Channels from 'components/Channels'
import Peers from 'components/Peers'
import styles from './Wallet.scss'

class Wallet extends Component {
  componentWillMount() {
    const { fetchPeers, fetchChannels, newAddress } = this.props

    fetchPeers()
    fetchChannels()
    newAddress('p2pkh')
  }

  render() {
    const {
      info,
      address: { address },
      ticker,
      peers: { peersLoading, peers, peer, peerForm },
      channels: { channelsLoading, channels, channel, channelForm, pendingChannels },
      fetchPeers,
      fetchChannels,
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
      closeChannel,
      currentTicker,
      explorerLinkBase
    } = this.props

    return (
      <div className={styles.wallet}>
        <section className={styles.walletData}>
          <Peers
            fetchPeers={fetchPeers}
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
            fetchChannels={fetchChannels}
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
            closeChannel={closeChannel}
            currentTicker={currentTicker}
            explorerLinkBase={explorerLinkBase}
          />
        </section>
      </div>
    )
  }
}

Wallet.propTypes = {
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
  openChannel: PropTypes.func.isRequired,
  closeChannel: PropTypes.func.isRequired,
  newAddress: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,
  explorerLinkBase: PropTypes.string.isRequired
}


export default Wallet
