// @flow
import React, { Component } from 'react'
import ChannelModal from './components/ChannelModal'
import Channel from './components/Channel'
import styles from './Channels.scss'

class Channels extends Component {
  render() {
    const {
        channelsLoading,
        channels,
        modalChannel,
        setChannel,
        channelModalOpen
    } = this.props
    return (
        <div className={styles.channels}>
            <ChannelModal isOpen={channelModalOpen} resetChannel={setChannel}>
                <h1>yooooo</h1>
            </ChannelModal>
            <h3>Channels</h3>
            <ul>
                {
                    !channelsLoading && channels.length ? 
                        channels.map(channel => 
                            <Channel
                                key={channel.chan_id}
                                channel={channel}
                                setChannel={setChannel} 
                            />
                        )
                    :
                        'Loading...'
                }
            </ul>
        </div>
    )
  }
}


export default Channels