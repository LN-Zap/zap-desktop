import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaAlignJustify, FaGlobe } from 'react-icons/lib/fa'
import { MdSearch } from 'react-icons/lib/md'

import Channel from 'components/Channels/Channel'
import NetworkChannels from 'components/Channels/NetworkChannels'
import ChannelForm from 'components/ChannelForm'

import styles from './Channels.scss'

class Channels extends Component {
  componentWillMount() {
    const { fetchChannels, fetchPeers, fetchDescribeNetwork } = this.props

    fetchChannels()
    fetchPeers()
    fetchDescribeNetwork()
  }

  render() {
    const {
      channels: { searchQuery, viewType },
      allChannels,
      openChannels,
      updateChannelSearchQuery,
      setViewType,

      openChannelForm,

      ticker,
      currentTicker,

      channelFormProps,

      network,
      identity_pubkey,
      setCurrentChannel
    } = this.props

    return (
      <div className={`${styles.container} ${viewType === 1 && styles.graphview}`}>
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
              <FaGlobe />
            </span>
          </div>
          <div className={styles.createChannelContainer}>
            <div className={`buttonPrimary ${styles.newChannelButton}`} onClick={openChannelForm}>
              Create new channel
            </div>
          </div>
        </header>

        <div className={styles.channels}>
          {
            viewType === 0 &&
            <ul className={viewType === 1 && styles.cardsContainer}>
              {
                allChannels.map((channel, index) => (
                  <Channel
                    key={index}
                    ticker={ticker}
                    channel={channel}
                    setChannel={() => {}}
                    currentTicker={currentTicker}
                  />
                ))
              }
            </ul>
          }
          { viewType === 1 &&
            <NetworkChannels
              channels={openChannels}
              network={network}
              identity_pubkey={identity_pubkey}
              setCurrentChannel={setCurrentChannel}
            />
          }
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
  openChannels: PropTypes.array.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  setViewType: PropTypes.func.isRequired,
  setCurrentChannel: PropTypes.func.isRequired,

  openChannelForm: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  channelFormProps: PropTypes.object.isRequired,

  network: PropTypes.object.isRequired,
  fetchDescribeNetwork: PropTypes.func.isRequired,
  identity_pubkey: PropTypes.string.isRequired
}

export default Channels
