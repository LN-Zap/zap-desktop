import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CanvasNetworkGraph from 'components/Network/CanvasNetworkGraph'
import PeersList from 'components/Network/PeersList'
import ChannelsList from 'components/Network/ChannelsList'
import TransactionForm from 'components/Network/TransactionForm'

import styles from './Network.scss'

class Network extends Component {
  componentWillMount() {
    const { fetchDescribeNetwork, fetchPeers, fetchChannels } = this.props

    fetchPeers()
    fetchChannels()
    fetchDescribeNetwork()
  }

  componentDidUpdate(prevProps) {
    const {
      payReqIsLn, network: { pay_req }, fetchInvoiceAndQueryRoutes, clearQueryRoutes
    } = this.props

    // If LN go retrieve invoice details
    if ((prevProps.network.pay_req !== pay_req) && payReqIsLn) {
      fetchInvoiceAndQueryRoutes(pay_req)
    }

    if (prevProps.payReqIsLn && !payReqIsLn) {
      clearQueryRoutes()
    }
  }

  componentWillUnmount() {
    const {
      clearQueryRoutes, resetPayReq, clearSelectedChannels, clearSelectedPeers
    } = this.props

    clearQueryRoutes()
    resetPayReq()
    clearSelectedChannels()
    clearSelectedPeers()
  }

  render() {
    const {
      setCurrentTab,
      updateSelectedPeers,
      setCurrentRoute,

      network,
      selectedPeerPubkeys,
      currentRouteChanIds,

      peers: { peers },

      activeChannels,
      selectedChannelIds,
      updateSelectedChannels,

      updatePayReq,

      identity_pubkey
    } = this.props

    const renderContent = () => {
      switch (network.currentTab) {
        case 1:
          return <PeersList peers={peers} updateSelectedPeers={updateSelectedPeers} selectedPeerPubkeys={selectedPeerPubkeys} />
        case 2:
          return <ChannelsList channels={activeChannels} updateSelectedChannels={updateSelectedChannels} selectedChannelIds={selectedChannelIds} />
        case 3:
          return (
            <TransactionForm
              updatePayReq={updatePayReq}
              pay_req={network.pay_req}
              loadingRoutes={network.fetchingInvoiceAndQueryingRoutes}
              payReqRoutes={network.payReqRoutes}
              setCurrentRoute={setCurrentRoute}
              currentRoute={network.currentRoute}
            />
          )
        default:
          return <span />
      }
    }

    return (
      <div className={styles.container}>
        {
          !network.networkLoading &&
          <section className={styles.stats}>
            <span>{network.nodes.length} nodes</span>
            <span>|</span>
            <span>{network.edges.length} channels</span>
          </section>
        }
        
        <CanvasNetworkGraph
          className={styles.network}
          network={network}
          identity_pubkey={identity_pubkey}
          selectedPeerPubkeys={selectedPeerPubkeys}
          selectedChannelIds={selectedChannelIds}
          currentRouteChanIds={currentRouteChanIds}
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
  fetchChannels: PropTypes.func.isRequired,
  fetchInvoiceAndQueryRoutes: PropTypes.func.isRequired,
  clearQueryRoutes: PropTypes.func.isRequired,
  resetPayReq: PropTypes.func.isRequired,
  clearSelectedChannels: PropTypes.func.isRequired,
  clearSelectedPeers: PropTypes.func.isRequired,
  updateSelectedPeers: PropTypes.func.isRequired,
  setCurrentRoute: PropTypes.func.isRequired,
  updateSelectedChannels: PropTypes.func.isRequired,
  updatePayReq: PropTypes.func.isRequired,

  network: PropTypes.object.isRequired,
  peers: PropTypes.object.isRequired,

  selectedPeerPubkeys: PropTypes.array.isRequired,
  currentRouteChanIds: PropTypes.array.isRequired,
  activeChannels: PropTypes.array.isRequired,
  selectedChannelIds: PropTypes.array.isRequired,

  identity_pubkey: PropTypes.string.isRequired,

  payReqIsLn: PropTypes.bool.isRequired
}

export default Network
