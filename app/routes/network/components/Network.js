import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import LoadingBolt from 'components/LoadingBolt'
import PeersList from 'components/Network/PeersList'

import styles from './Network.scss'

class Network extends Component {
  componentWillMount() {
    const { fetchDescribeNetwork, fetchPeers, fetchChannels } = this.props

    fetchDescribeNetwork()
    fetchPeers()
    fetchChannels()
  }

  render() {
    const {
      setCurrentTab,

      network: { nodes, edges, selectedNode, networkLoading, currentTab },
      peers: { peers },
      channels,
      identity_pubkey
    } = this.props

    console.log('props: ', this.props)

    if (networkLoading) return <LoadingBolt />

    const renderTab = () => {
      switch(currentTab) {
        case 1:
          return <PeersList peers={peers} />
          break
        case 2:
          return <h1>channels</h1>
          break
        case 3:
          return <h1>transaction</h1>
          break
      }
    }

    return (
      <div className={styles.container}>
        <section className={styles.network}>
          <InteractiveForceGraph
            simulationOptions={
              {
                height: 1000,
                width: 800,
                strength: { 
                  charge: -750
                },
                animate: true 
              }
            }
            labelAttr='label'
            onSelectNode={node => console.log('node: ', node)}
            opacityFactor={1}
            zoomOptions={{ minScale: 0.1, maxScale: 5 }}
            zoom
            highlightDependencies
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
                    fill={
                      identity_pubkey === node.pub_key || selectedNode.pubkey === node.pub_key ? '#00FF00' : 'black'
                    }
                  />
                )
              })
            }
            {
              edges.map(edge => {
                return (
                  <ForceGraphLink
                    className={selectedNode.pubkey.length}
                    key={edge.channel_id}
                    link={{ source: edge.node1_pub, target: edge.node2_pub }}
                    stroke={'silver'}
                    strokeWidth='5'
                    ref={line => this[edge.channel_id] = line}
                  />
                )
              })
            }
          </InteractiveForceGraph>
        </section>
        <section className={styles.data}>
          <header>
            <h1>Toolbox</h1>
          </header>

          <ul className={styles.tabs}>
            <li className={`${styles.tab} ${currentTab === 1 && styles.active}`} onClick={() => setCurrentTab(1)}>
              <h2>Peers</h2>
            </li>
            <li className={`${styles.tab} ${currentTab === 2 && styles.active}`} onClick={() => setCurrentTab(2)}>
              <h2>Channels</h2>
            </li>
            <li className={`${styles.tab} ${currentTab === 3 && styles.active}`} onClick={() => setCurrentTab(3)}>
              <h2>Transaction</h2>
            </li>
          </ul>

          <div className={styles.currentTab}>
            {
             renderTab() 
            }
          </div>
        </section>
      </div>
    )
  }
}

Network.propTypes = {}

export default Network
