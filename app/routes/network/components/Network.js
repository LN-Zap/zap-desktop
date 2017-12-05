import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'

import NetworkGraph from 'components/Network/NetworkGraph'
import PeersList from 'components/Network/PeersList'
import ChannelsList from 'components/Network/ChannelsList'

import styles from './Network.scss'

class Network extends Component {
  componentWillMount() {
    const { fetchDescribeNetwork, fetchPeers, fetchChannels } = this.props

    fetchPeers()
    fetchChannels()
    fetchDescribeNetwork()
  }

  render() {
    const {
      setCurrentTab,
      updateSelectedPeers,

      network,
      selectedPeerPubkeys,

      peers: { peers },
      
      activeChannels,
      selectedChannelIds,
      updateSelectedChannels,

      identity_pubkey
    } = this.props

    const renderContent = () => {
      switch(network.currentTab) {
        case 1:
          return <PeersList peers={peers} updateSelectedPeers={updateSelectedPeers} selectedPeerPubkeys={selectedPeerPubkeys} />
          break
        case 2:
          return <ChannelsList channels={activeChannels} updateSelectedChannels={updateSelectedChannels} selectedChannelIds={selectedChannelIds} />
          break
        case 3:
          return <h1>transactions</h1>
          break
      }
    }

    return (
      <div className={styles.container}>
        <NetworkGraph
          className={styles.network}
          network={network}
          identity_pubkey={identity_pubkey}
          selectedPeerPubkeys={selectedPeerPubkeys}
          selectedChannelIds={selectedChannelIds}
        />

        <section className={styles.toolbox}>
          <ul className={styles.tabs}>
            <li
              className={`${styles.tab} ${styles.peersTab} ${network.currentTab === 1 && styles.active}`}
              onClick={() => setCurrentTab(1)}
            >
              Peers
            </li>
            <li
              className={`${styles.tab} ${styles.channelsTab} ${network.currentTab === 2 && styles.active}`}
              onClick={() => setCurrentTab(2)}
            >
              Channels
            </li>
            <li
              className={`${styles.tab} ${styles.transactionsTab} ${network.currentTab === 3 && styles.active}`}
              onClick={() => setCurrentTab(3)}
            >
              Transactions
            </li>
          </ul>

          <div className={styles.content}>
            {renderContent()}
          </div>
        </section>
      </div>
    )
  }
}

Network.propTypes = {
  fetchDescribeNetwork: PropTypes.func.isRequired,
  fetchPeers: PropTypes.func.isRequired,
  setCurrentTab: PropTypes.func.isRequired,

  network: PropTypes.object.isRequired,
  peers: PropTypes.object.isRequired,

  identity_pubkey: PropTypes.string.isRequired
}

export default Network
