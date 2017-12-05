import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import { FaCircle } from 'react-icons/lib/fa'
import styles from './NetworkGraph.scss'

class NetworkGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false
    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ ready: true })
    }, 1000)
  }

  render() {
    const { ready } = this.state
    const {
      network: { nodes, edges, selectedChannel, networkLoading },
      selectedPeerPubkeys,
      selectedChannelIds,
      identity_pubkey,
    } = this.props

    if (!ready || networkLoading) {
      return (
        <section className={styles.network}>
          <div className={styles.networkLoading}>
            <h1>loading network graph</h1>
          </div>
        </section>
      )
    }

    console.log('selectedChannelIds: ', selectedChannelIds)
    return (
      <section className={styles.network}>
        <ForceGraph
          simulationOptions={
            {
              height: 800,
              width: 800,
              strength: { 
                charge: -750
              }
            }
          }
          labelAttr='label'
          opacityFactor={1}
          highlightDependencies
          zoomOptions={{ minScale: 0.1, maxScale: 5, scale: 0.2 }}
          zoom
        >
          {
            nodes.map(node =>
              <ForceGraphNode
                r={25}
                label={node.pub_key}
                key={node.pub_key}
                node={{ id: node.pub_key }}
                fill={selectedPeerPubkeys.includes(node.pub_key) ? '#5589F3' : '#353535'}
                strokeWidth={2.5}
                className={styles.node}
              />
            )
          }
          {
            edges.map(edge =>
              <ForceGraphLink
                className={selectedChannelIds.includes(edge.channel_id) && styles.activeEdge}
                key={edge.channel_id}
                link={{ source: edge.node1_pub, target: edge.node2_pub }}
                stroke='silver'
                strokeWidth='5'
              />
            )
          }
        </ForceGraph>
      </section>
    )
  }
}

NetworkGraph.propTypes = {
  network: PropTypes.object.isRequired,
  identity_pubkey: PropTypes.string.isRequired
}

export default NetworkGraph