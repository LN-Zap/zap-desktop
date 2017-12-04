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

    return (
      <section className={styles.network}>
        <ForceGraph
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