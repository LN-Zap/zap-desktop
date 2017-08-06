// @flow
import React, { Component } from 'react'
import ReactSVG from 'react-svg'
import { FaCircle } from 'react-icons/lib/fa'
import Peers from './components/peers'
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
  		channels: { channelsLoading, channels, channel, form },
      channelModalOpen,
      setChannel,
      setForm
  	} = this.props

    return (  
      <div className={styles.wallet}>
        <section className={styles.header}>
        	<ReactSVG path='../resources/zap_2.svg' />
        	<h1>{info.data.identity_pubkey}</h1>
        </section>
        <section className={styles.walletData}>
          <Peers
            peersLoading={peersLoading}
            peers={peers}
          />
          <Channels
            channelsLoading={channelsLoading}
            channels={channels}
            modalChannel={channel}
            setChannel={setChannel}
            channelModalOpen={channelModalOpen}
            form={form}
            setForm={setForm}
          />
        </section>
      </div>
    )
  }
}


export default Wallet