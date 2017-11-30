import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaAlignJustify, FaGlobe, FaAngleDown, FaRepeat } from 'react-icons/lib/fa'
import { MdSearch } from 'react-icons/lib/md'

import OpenPendingChannel from 'components/Channels/OpenPendingChannel'
import ClosedPendingChannel from 'components/Channels/ClosedPendingChannel'
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
      fetchChannels,
      closeChannel,
      channels: {
        searchQuery,
        filterPulldown,
        filter,
        viewType
      },

      nonActiveFilters,
      toggleFilterPulldown,
      changeFilter,

      activeChannels,
      currentChannels,
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

    const refreshClicked = (event) => {
      // store event in icon so we dont get an error when react clears it
      const icon = event.currentTarget

      // fetch peers
      fetchChannels()

      // clear animation after the second so we can reuse it
      setTimeout(() => { icon.style.animation = '' }, 1000)

      // spin icon for 1 sec
      icon.style.animation = 'spin 1000ms linear 1'
    }

    const networkClicked = () => {
      if (!activeChannels.length) { return }
        
      setViewType(1)
    }

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
            <span className={viewType === 1 && styles.active} onClick={networkClicked}>
              <FaGlobe />
            </span>
          </div>
          <div className={styles.createChannelContainer}>
            <div className={`buttonPrimary ${styles.newChannelButton}`} onClick={openChannelForm}>
              Create new channel
            </div>
          </div>
        </header>

        <div className={styles.filtersContainer}>
          <section>
            <h2 onClick={toggleFilterPulldown} className={styles.filterTitle}>
              {filter.name} <span className={filterPulldown && styles.pulldown}><FaAngleDown /></span>
            </h2>
            <ul className={`${styles.filters} ${filterPulldown && styles.active}`}>
              {
                nonActiveFilters.map(f => (
                  <li key={f.key} onClick={() => changeFilter(f)}>
                    {f.name}
                  </li>
                ))
              }
            </ul>
          </section>
          <section className={`${styles.refreshContainer} hint--left`} data-hint='Refresh your channels list'>
            <FaRepeat
              style={{ verticalAlign: 'baseline' }}
              onClick={refreshClicked}
            />
          </section>
        </div>

        <div className={`${styles.channels} ${filterPulldown && styles.fade}`}>
          {
            viewType === 0 &&
            <ul className={viewType === 1 && styles.cardsContainer}>
              {
                currentChannels.map((channel, index) => {
                  if (Object.prototype.hasOwnProperty.call(channel, 'blocks_till_open')) {
                    return (
                      <OpenPendingChannel
                        key={index}
                        channel={channel}
                        ticker={ticker}
                        currentTicker={currentTicker}
                        explorerLinkBase={'https://testnet.smartbit.com.au/'}
                      />
                    )
                  } else if (Object.prototype.hasOwnProperty.call(channel, 'closing_txid')) {
                    return (
                      <ClosedPendingChannel
                        key={index}
                        channel={channel}
                        ticker={ticker}
                        currentTicker={currentTicker}
                        explorerLinkBase={'https://testnet.smartbit.com.au/'}
                      />
                    )
                  }
                  return (
                    <Channel
                      key={index}
                      ticker={ticker}
                      channel={channel}
                      closeChannel={closeChannel}
                      currentTicker={currentTicker}
                    />
                  )
                })
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
  currentChannels: PropTypes.array.isRequired,
  openChannels: PropTypes.array.isRequired,
  nonActiveFilters: PropTypes.array.isRequired,
  
  updateChannelSearchQuery: PropTypes.func.isRequired,
  setViewType: PropTypes.func.isRequired,
  setCurrentChannel: PropTypes.func.isRequired,
  openChannelForm: PropTypes.func.isRequired,
  closeChannel: PropTypes.func.isRequired,
  toggleFilterPulldown: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,

  ticker: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  channelFormProps: PropTypes.object.isRequired,

  network: PropTypes.object.isRequired,
  fetchDescribeNetwork: PropTypes.func.isRequired,
  identity_pubkey: PropTypes.string.isRequired
}

export default Channels
