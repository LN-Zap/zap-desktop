// @flow
import React, { Component } from 'react'
import ReactSVG from 'react-svg'
import { FaCircle } from 'react-icons/lib/fa'
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
  		channels: { channelsLoading, channels }
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
        	<div className={styles.channels}>
        		<h3>Channels</h3>
        		<ul>
        			{
        				!channelsLoading && channels.length ?
        					channels.map(channel => {
        						console.log('channel: ', channel)
        						return (
        							<li key={channel.chan_id} className={styles.channel}>
        								<div className={styles.left}>
        									<section className={styles.remotePubkey}>
        										<span>
        											Remote Pubkey
        										</span>
        										<h4>
        											{channel.remote_pubkey}
        										</h4>
        									</section>
        									<section className={styles.channelPoint}>
        										<span>
        											Channel Point
        										</span>
        										<h4>
        											{channel.channel_point}
        										</h4>
        									</section>
        								</div>
        								<div className={styles.right}>
        									<section className={styles.capacity}>
        										<span>
        											Capacity
        										</span>
        										<h2>
        											{channel.capacity}
        										</h2>
        									</section>
        									<div className={styles.balances}>
        										<section>
        											<h4>{channel.local_balance}</h4>
        											<span>Local</span>
        										</section>
        										<section>
        											<h4>{channel.remote_balance}</h4>
        											<span>Remote</span>
        										</section>
        									</div>
        								</div>
        							</li>
        						)
        					})
        				:
        					'Loading...'
        			}
        		</ul>
        	</div>
        </section>
      </div>
    )
  }
}


export default Wallet