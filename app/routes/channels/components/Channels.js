import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaAlignJustify, FaGlobe, FaAngleDown, FaRepeat } from 'react-icons/lib/fa'
import { MdSearch } from 'react-icons/lib/md'

import OpenPendingChannel from 'components/Channels/OpenPendingChannel'
import ClosedPendingChannel from 'components/Channels/ClosedPendingChannel'
import Channel from 'components/Channels/Channel'
import ChannelForm from 'components/ChannelForm'

import styles from './Channels.scss'

class Channels extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

  componentWillMount() {
    const { fetchChannels, fetchPeers } = this.props
    
    fetchChannels()
    fetchPeers()
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

      channelFormProps
    } = this.props

    const refreshClicked = event => {
      // turn the spinner on
      this.setState({ refreshing: true })

      // store event in icon so we dont get an error when react clears it
      let icon = this.refs.repeat.childNodes

      // fetch peers
      fetchChannels()

      // wait for the svg to appear as child
      let svgTimeout = setTimeout(() => { 
        if (icon[0].tagName === 'svg') {
          // spin icon for 1 sec
          icon[0].style.animation = 'spin 1000ms linear 1'
          clearTimeout(svgTimeout)
        }
      }, 1)

      // clear animation after the second so we can reuse it
      let refreshTimeout = setTimeout(() => { 
        icon[0].style.animation = ''
        this.setState({ refreshing: false })
        clearTimeout(refreshTimeout)
      }, 1000)
    }

    return (
      <div className={`${styles.container} ${viewType === 1 && styles.graphview}`}>
        <ChannelForm {...channelFormProps} />

        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <div className={styles.left}>
              <h1>Channels</h1>
            </div>
          </div>
          <div className={styles.createChannelContainer}>
            <div className={`buttonPrimary ${styles.newChannelButton}`} onClick={openChannelForm}>
              Create new channel
            </div>
          </div>
        </header>
        
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
          <section className={styles.refreshContainer}>
            <span className={styles.refresh} onClick={refreshClicked} ref='repeat'>
              {
                this.state.refreshing ?
                  <FaRepeat />
                :
                  'Refresh'
              }
            </span>
          </section>
        </div>

        <div className={`${styles.channels} ${filterPulldown && styles.fade}`}>
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
        </div>
      </div>
    )
  }
}

Channels.propTypes = {
  fetchChannels: PropTypes.func.isRequired,

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

  channelFormProps: PropTypes.object.isRequired
}

export default Channels
