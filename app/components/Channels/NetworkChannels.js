import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import { FaCircle } from 'react-icons/lib/fa'
import styles from './NetworkChannels.scss'

class NetworkChannels extends Component {
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

    this.props.setCurrentChannel(this.props.channels[0])
  }

  render() {
    const { ready } = this.state
    const {
      channels,
      network: { nodes, edges, selectedChannel, networkLoading },
      identity_pubkey,
      setCurrentChannel
    } = this.props

    if (!ready || networkLoading) {
      return (
        <div className={styles.networkLoading}>
          <h1>loading network graph</h1>
        </div>
      )
    }

    return (
      <div className={styles.networkchannels}>
        <div className={styles.network}>
          <ForceGraph
            simulationOptions={
              {
                width: 1000,
                height: 1000,
                strength: {
                  charge: -750
                }
              }
            }
            labelAttr='label'
            opacityFactor={1}
            zoomOptions={{ minScale: 0.1, maxScale: 5 }}
            zoom
            animate
            highlightDependencies
          >
            {
              nodes.map(node => (
                <ForceGraphNode
                  r={15}
                  label={node.pub_key}
                  key={node.pub_key}
                  node={{ id: node.pub_key }}
                  className={`${styles.node} ${identity_pubkey === node.pub_key && styles.active}`}
                  fill={identity_pubkey === node.pub_key ? 'green' : 'silver'}
                />
              ))
            }
            {
              edges.map(edge => (
                <ForceGraphLink
                  className={`${styles.line} ${selectedChannel.chan_id === edge.channel_id && styles.active}`}
                  key={edge.channel_id}
                  link={{ source: edge.node1_pub, target: edge.node2_pub }}
                />
              ))
            }
          </ForceGraph>
        </div>
        <div className={styles.channels}>
          <ul>
            {
              channels.map((channel, index) => (
                <li
                  key={index}
                  className={`${styles.channel} ${channel.chan_id === selectedChannel.chan_id && styles.active}`}
                  onClick={() => setCurrentChannel(channel)}
                >
                  <header>
                    {
                      channel.active ?
                        <span className={styles.active}>
                          <FaCircle />
                          <i>active</i>
                        </span>
                        :
                        <span className={styles.notactive}>
                          <FaCircle />
                          <i>not active</i>
                        </span>
                    }
                  </header>
                  <div className={styles.content}>
                    <div>
                      <h4>Remote Pubkey</h4>
                      <h2>{`${channel.remote_pubkey.substring(30, channel.remote_pubkey.length)}...`}</h2>
                    </div>
                    <div>
                      <h4>Channel Point</h4>
                      <h2>{`${channel.channel_point.substring(30, channel.channel_point.length)}...`}</h2>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    )
  }
}

NetworkChannels.propTypes = {
  channels: PropTypes.array.isRequired,
  network: PropTypes.object.isRequired,
  identity_pubkey: PropTypes.string.isRequired,
  setCurrentChannel: PropTypes.func.isRequired
}

export default NetworkChannels
