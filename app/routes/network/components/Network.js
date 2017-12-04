import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'

import LoadingBolt from 'components/LoadingBolt'
import PeersList from 'components/Network/PeersList'

import styles from './Network.scss'

class Network extends Component {
  componentWillMount() {
    const { fetchDescribeNetwork, fetchPeers } = this.props

    fetchPeers()
    fetchDescribeNetwork()
  }

  render() {
    const {
      setCurrentTab,

      network: { nodes, edges, networkLoading, currentTab },
      peers: { peers },
      identity_pubkey
    } = this.props

    const renderContent = () => {
      switch(currentTab) {
        case 1:
          return <PeersList peers={peers} />
          break
        case 2:
          return <h1>channels</h1>
          break
        case 3:
          return <h1>transactions</h1>
          break
      }
    }

    if (!nodes.length || !edges.length) { return <span></span> }
    if (networkLoading) return <LoadingBolt />

    return (
      <div className={styles.container}>
        <section className={styles.network}>
          <InteractiveForceGraph
            simulationOptions={
              {
                height: 800,
                width: 800,
                strength: { 
                  charge: -500
                }
              }
            }
            labelAttr='label'
            onSelectNode={node => console.log('node: ', node)}
            opacityFactor={1}
            highlightDependencies
            zoomOptions={{ minScale: 0.1, maxScale: 5, scale: 0.2 }}
            zoom
          >
            <path d="M534.7054286266647, 460.3260926684966" fill="red" stroke="blue" />
            {
              nodes.map(node => {
                return (
                  <ForceGraphNode
                    r={15}
                    label={node.pub_key}
                    key={node.pub_key}
                    node={{ id: node.pub_key }}
                    fill={identity_pubkey === node.pub_key ? 'white' : 'black'}
                  />
                )
              })
            }
            {
              edges.map(edge => {
                return (
                  <ForceGraphLink
                    key={edge.channel_id}
                    link={{ source: edge.node1_pub, target: edge.node2_pub }}
                    stroke='silver'
                    strokeWidth='5'
                  />
                )
              })
            }
          </InteractiveForceGraph>
        </section>
        <section className={styles.toolbox}>
          <ul className={styles.tabs}>
            <li
              className={`${styles.tab} ${styles.peersTab} ${currentTab === 1 && styles.active}`}
              onClick={() => setCurrentTab(1)}
            >
              Peers
            </li>
            <li
              className={`${styles.tab} ${styles.channelsTab} ${currentTab === 2 && styles.active}`}
              onClick={() => setCurrentTab(2)}
            >
              Channels
            </li>
            <li
              className={`${styles.tab} ${styles.transactionsTab} ${currentTab === 3 && styles.active}`}
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
