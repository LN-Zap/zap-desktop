import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaAlignJustify, FaThLarge } from 'react-icons/lib/fa'
import { MdSearch } from 'react-icons/lib/md'

import Channel from 'components/Channels/Channel'
import CardChannel from 'components/Channels/CardChannel'
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
      channels: { channels, searchQuery, viewType },
      allChannels,
      updateChannelSearchQuery,
      setViewType,
      
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
            value={searchQuery}
            onChange={event => updateChannelSearchQuery(event.target.value)}
            className={`${styles.text} ${styles.input}`}
            placeholder='Search channels by funding transaction or remote public key'
            type='text'
            id='channelSearch'
          />
        </div>
        <header className={styles.header}>
          <div className={styles.layoutsContainer}>
            <span className={viewType === 0 && styles.active} onClick={() => setViewType(0)}>
              <FaAlignJustify />
            </span>
            <span className={viewType === 1 && styles.active} onClick={() => setViewType(1)}>
              <FaThLarge />
            </span>
          </div>
          <div className={styles.createChannelContainer}>
            <div className={`buttonPrimary ${styles.newChannelButton}`} onClick={openChannelForm}>
              Create new channel
            </div>
          </div>
        </header>

        <div className={styles.channels}>
          <ul className={viewType === 1 && styles.cardsContainer}>
          { viewType === 0 && allChannels.map((channel, index) => {
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
          { viewType === 1 && allChannels.map((channel, index) => {
              return (
                <CardChannel key={index}>
                  card channel
                </CardChannel>
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
