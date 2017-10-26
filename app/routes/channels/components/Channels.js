import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaAlignJustify, FaThLarge } from 'react-icons/lib/fa'
import { MdSearch } from 'react-icons/lib/md'

import Channel from 'components/Channels/Channel'
import ChannelForm from 'components/ChannelForm'

import styles from './Channels.scss'

class Channels extends Component {
  componentWillMount() {
    const { fetchChannels, fetchPeers } = this.props
    
    fetchChannels()
    fetchPeers()
  }

  render() {
    const {
      channels: { channels },
      allChannels,
      
      closeChannelForm,
      openChannelForm,
      channelform,
      channelFormHeader,
      channelFormProgress,

      peers: { peers },

      ticker,
      currentTicker,

      channelFormProps
    } = this.props

    return (
      <div className={styles.container}>
        <ChannelForm {...channelFormProps} />

        <div className={styles.search}>
          <label className={`${styles.label} ${styles.input}`} htmlFor='channelSearch'>
            <MdSearch />
          </label>
          <input
            value={''}
            onChange={event => console.log('event: ', event)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search channels by funding transaction, channel id, remote public key, etc'
            type='text'
            id='channelSearch'
          />
        </div>
        <header className={styles.header}>
          <div className={styles.layoutsContainer}>
            <span className={styles.active}>
              <FaAlignJustify />
            </span>
            <span>
              <FaThLarge />
            </span>
          </div>
          <div className={styles.createChannelContainer}>
            <div className='buttonPrimary' onClick={openChannelForm}>
              Create new channel
            </div>
          </div>
        </header>

        <div className={styles.channels}>
          <ul>
          {
            allChannels.map((channel, index) => {
              return (
                <Channel
                  key={index}
                  ticker={ticker}
                  channel={channel}
                  setChannel={() => console.log('hi')}
                  currentTicker={currentTicker}
                />
              )
            })
          }
          </ul>
        </div>
      </div>
    )
  }
}

Channels.propTypes = {
  
}

export default Channels
