import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaAlignJustify, FaThLarge } from 'react-icons/lib/fa'
import { MdSearch } from 'react-icons/lib/md'

import Channel from 'components/Channels/Channel'

import styles from './Channels.scss'

class Channels extends Component {
  componentWillMount() {
    this.props.fetchChannels()
  }

  render() {
    const {
      channels: { channels },
      allChannels,

      ticker,
      currentTicker
    } = this.props
    console.log('channels: ', channels)

    return (
      <div className={styles.container}>
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
            <div className='buttonPrimary'>
              Create new channel
            </div>
          </div>
        </header>

        <div className={styles.channels}>
          <ul>
          {
            allChannels.map((channel, index) => {
              console.log('channel: ', channel)

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
