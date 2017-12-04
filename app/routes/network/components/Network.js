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
      fetchDescribeNetwork,

      network: { nodes, edges, networkLoading },
      peers: { peers },
      identity_pubkey
    } = this.props

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
            <li className={`${styles.tab} ${styles.peersTab}`}>
              Peers
            </li>
            <li className={`${styles.tab} ${styles.channelsTab}`}>
              Channels
            </li>
            <li className={`${styles.tab} ${styles.transactionsTab}`}>
              Transactions
            </li>
          </ul>

          <div className={styles.content}>
            <PeersList peers={peers} />
          </div>
        </section>
      </div>
    )
  }
}

Network.propTypes = {}

export default Network
