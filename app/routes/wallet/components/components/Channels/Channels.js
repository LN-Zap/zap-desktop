// @flow
import React, { Component } from 'react'
import { TiPlus } from 'react-icons/lib/ti'
import ChannelModal from './components/ChannelModal'
import ChannelForm from './components/ChannelForm'
import Channel from './components/Channel'
import OpenPendingChannel from './components/OpenPendingChannel'
import ClosedPendingChannel from './components/ClosedPendingChannel'
import styles from './Channels.scss'

class Channels extends Component {
  render() {
    const {
        ticker,
        peers,
        channelsLoading,
        channels,
        modalChannel,
        setChannel,
        channelModalOpen,
        channelForm,
        setChannelForm,
        pendingChannels,
        allChannels,
        openChannel
    } = this.props

    return (
        <div className={styles.channels}>
            <ChannelModal isOpen={channelModalOpen} resetChannel={setChannel} channel={modalChannel} />
            <ChannelForm form={channelForm} setForm={setChannelForm} ticker={ticker} peers={peers} openChannel={openChannel} />
            <div className={styles.header}>
                <h3>Channels</h3>
                <div
                    className={`${styles.openChannel} hint--top`}
                    data-hint='Open a channel'
                    onClick={() => setChannelForm({ isOpen: true })}
                >
                    <TiPlus />  
                </div>
            </div>
            <ul>
                {
                    !channelsLoading ? 
                        allChannels.map((channel, index) => {
                            if (channel.hasOwnProperty('blocks_till_open')) {
                                return (
                                    <OpenPendingChannel key={index} channel={channel} ticker={ticker} />
                                )
                            } else if (channel.hasOwnProperty('closing_txid')) {
                                return (
                                    <ClosedPendingChannel key={index} channel={channel} ticker={ticker} />
                                )
                            } else {
                                return (
                                    <Channel
                                        key={channel.chan_id}
                                        ticker={ticker}
                                        channel={channel}
                                        setChannel={setChannel}
                                    />
                                )
                            }
                        })
                    :
                        'Loading...'
                }
            </ul>
        </div>
    )
  }
}

export default Channels
