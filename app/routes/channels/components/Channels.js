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
      channels: { searchQuery, viewType },
      allChannels,
      updateChannelSearchQuery,
      setViewType,

      openChannelForm,

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
            <span className={viewType === 1 && styles.active}>
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
            { viewType === 0 && allChannels.map((channel, index) => (
              <Channel
                key={index}
                ticker={ticker}
                channel={channel}
                setChannel={() => console.log('hi')}
                currentTicker={currentTicker}
              />
            ))
            }
            { viewType === 1 && allChannels.map((channel, index) => (
              <CardChannel key={index} channel={channel}>
                  card channel
              </CardChannel>
            ))
            }
          </ul>
        </div>
      </div>
    )
  }
}

Channels.propTypes = {
  fetchChannels: PropTypes.func.isRequired,
  fetchPeers: PropTypes.func.isRequired,

  channels: PropTypes.object.isRequired,
  allChannels: PropTypes.array.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  setViewType: PropTypes.func.isRequired,

  openChannelForm: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  channelFormProps: PropTypes.object.isRequired
}

export default Channels
