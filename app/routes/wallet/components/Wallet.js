// @flow
import React, { Component } from 'react'
import ReactSVG from 'react-svg'
import { FaCircle } from 'react-icons/lib/fa'
import Channels from './components/channels'
import styles from './Wallet.scss'

class Wallet extends Component {
	componentWillMount() {
		const { fetchInfo, fetchPeers, fetchChannels } = this.props
		
		fetchInfo()
		fetchPeers()
		fetchChannels()
	}

  render() {
  	const {
  		info,
  		peers: { peersLoading, peers },
  		channels: { channelsLoading, channels, channel },
      channelModalOpen,
      setChannel
  	} = this.props

    return (  
      <div className={styles.wallet}>
        <section className={styles.header}>
        	<ReactSVG path='../resources/zap_2.svg' />
        	<h1>{info.data.identity_pubkey}</h1>
        </section>
        <section className={styles.walletData}>
        	<div className={styles.peers}>
        		<h3>Connected Peers</h3>
        		<ul>
        		</ul>
        	</div>
            <Channels
              channelsLoading={channelsLoading}
              channels={channels}
              modalChannel={channel}
              setChannel={setChannel}
              channelModalOpen={channelModalOpen}
            />
        </section>
      </div>
    )
  }
}


export default Wallet