import { findDOMNode } from 'react-dom'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import { FaCircle } from 'react-icons/lib/fa'
import Isvg from 'react-inlinesvg'
import LoadingBolt from 'components/LoadingBolt'
import bitcoinIcon from 'icons/skinny_bitcoin.svg'
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
    }, 10000)
  }

  render() {
    const { ready } = this.state
    const {
      network: { nodes, edges, selectedChannel, networkLoading },
      selectedPeerPubkeys,
      selectedChannelIds,
      currentRouteChanIds,
      identity_pubkey
    } = this.props

    if ((!nodes.length || !edges.length) || networkLoading) {
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
          id='map'
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
          zoomOptions={{ minScale: 0.1, maxScale: 5, scale: 0.2 }}
          zoom
          highlightDependencies
          ref={(el) => {
            console.log('el: ', el)
            this.fg = el
          }}
        >
          {
            nodes.map(node =>
              <ForceGraphNode
                id={node.pub_key}
                r={25}
                label={node.pub_key}
                key={node.pub_key}
                node={{ id: node.pub_key }}
                strokeWidth={2.5}
                className={`${styles.node} ${identity_pubkey === node.pub_key && styles.owner} ${selectedPeerPubkeys.includes(node.pub_key) && styles.peer}`}
              />
            )
          }
          {
            edges.map(edge => {
              return (
                <ForceGraphLink
                  id={edge.channel_id}
                  className={selectedChannelIds.includes(edge.channel_id) && styles.activeEdge}
                  key={edge.channel_id}
                  link={{ source: edge.node1_pub, target: edge.node2_pub }}
                  stroke='silver'
                  strokeWidth='5'
                />
              )
            })
          }

          {
            currentRouteChanIds.map((chan_id) => {
              const line = document.getElementById(chan_id)

              if (!line) { return }
              const x1 = line.x1.baseVal.value
              const x2 = line.x2.baseVal.value
              const y1 = line.y1.baseVal.value
              const y2 = line.y2.baseVal.value

              return (
                <circle id={`circle-${chan_id}`} r="10" cx={x1} cy={y1} fill="#FFDC53" zoomable />
              )
            })
          }

          {
            currentRouteChanIds.map((chan_id) => {
              const line = document.getElementById(chan_id)

              if (!line) { return }
              const x1 = line.x1.baseVal.value
              const x2 = line.x2.baseVal.value
              const y1 = line.y1.baseVal.value
              const y2 = line.y2.baseVal.value

              return (
                <animate 
                  xlinkHref={`#circle-${chan_id}`}
                  attributeName="cx"
                  from={x1}
                  to={x2}
                  dur="1s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              )
            })
          }
          {
            currentRouteChanIds.map((chan_id) => {
              const line = document.getElementById(chan_id)

              if (!line) { return }
              const x1 = line.x1.baseVal.value
              const x2 = line.x2.baseVal.value
              const y1 = line.y1.baseVal.value
              const y2 = line.y2.baseVal.value

              return (
                <animate 
                  xlinkHref={`#circle-${chan_id}`}
                  attributeName="cy"
                  from={y1}
                  to={y2}
                  dur="1s"
                  fill="freeze"
                  repeatCount="indefinite"
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