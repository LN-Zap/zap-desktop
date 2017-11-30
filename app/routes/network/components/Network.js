import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import LoadingBolt from '../../../components/LoadingBolt'

import styles from './Network.scss'

class Network extends Component {
  componentWillMount() {
    const { fetchDescribeNetwork } = this.props

    fetchDescribeNetwork()
  }

  render() {
    const {
      network: { nodes, edges, selectedNode, networkLoading },
      identity_pubkey
    } = this.props

    console.log('props: ', this.props)

    if (networkLoading) return <LoadingBolt />

    return (
      <div className={styles.container}>
        <section className={styles.network}>
          <InteractiveForceGraph
            simulationOptions={
              {
                height: 1000,
                width: 1000,
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
      </div>
    )
  }
}

Network.propTypes = {}

export default Network
