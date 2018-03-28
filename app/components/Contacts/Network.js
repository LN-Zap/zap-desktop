import React, { Component } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import Isvg from 'react-inlinesvg'
import { FaAngleDown, FaCircle, FaRepeat } from 'react-icons/lib/fa'
import { btc } from 'utils'
import plus from 'icons/plus.svg'
import search from 'icons/search.svg'

import styles from './Network.scss'

class Network extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

  render() {
    const {
      channels: {
        searchQuery,
        filterPulldown,
        filter
        // loadingChannelPubkeys,
        // closingChannelIds
      },
      currentChannels,
      balance,
      currentTicker,

      nodes,

      fetchChannels,
      openContactsForm,

      nonActiveFilters,
      toggleFilterPulldown,
      changeFilter,

      updateChannelSearchQuery,

      openContactModal
    } = this.props


    const refreshClicked = () => {
      // turn the spinner on
      this.setState({ refreshing: true })

      // store event in icon so we dont get an error when react clears it
      const icon = this.repeat.childNodes

      // fetch channels
      fetchChannels()

      // wait for the svg to appear as child
      const svgTimeout = setTimeout(() => {
        if (icon[0].tagName === 'svg') {
          // spin icon for 1 sec
          icon[0].style.animation = 'spin 1000ms linear 1'
          clearTimeout(svgTimeout)
        }
      }, 1)

      // clear animation after the second so we can reuse it
      const refreshTimeout = setTimeout(() => {
        icon[0].style.animation = ''
        this.setState({ refreshing: false })
        clearTimeout(refreshTimeout)
      }, 1000)
    }

    const displayNodeName = (channel) => {
      const node = find(nodes, n => channel.remote_pubkey === n.pub_key)

      if (node && node.alias.length) { return node.alias }

      return channel.remote_pubkey ? channel.remote_pubkey.substring(0, 10) : channel.remote_node_pub.substring(0, 10)
    }

    const channelStatus = (channel) => {
      if (Object.prototype.hasOwnProperty.call(channel, 'confirmation_height')) { return 'pending' }
      if (Object.prototype.hasOwnProperty.call(channel, 'closing_txid')) { return 'closing' }
      if (!channel.active) { return 'offline' }

      return 'online'
    }

    const usdAmount = btc.satoshisToUsd(balance.channelBalance, currentTicker.price_usd)

    return (
      <div className={styles.network}>
        <header className={styles.header}>
          <section>
            <h2>My Network</h2>
            <span className={styles.channelAmount}>
              {btc.satoshisToBtc(balance.channelBalance)}BTC ≈ ${usdAmount ? usdAmount.toLocaleString() : ''}
            </span>
          </section>
          <section className={`${styles.addChannel} hint--bottom-left`} onClick={openContactsForm} data-hint='Open a channel'>
            <span className={styles.plusContainer}>
              <Isvg src={plus} />
            </span>
          </section>
        </header>

        <div className={styles.channels}>
          <header className={styles.listHeader}>
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
              <span className={styles.refresh} onClick={refreshClicked} ref={(ref) => { this.repeat = ref }}>
                {
                  this.state.refreshing ?
                    <FaRepeat />
                    :
                    'Refresh'
                }
              </span>
            </section>
          </header>

          <ul className={filterPulldown && styles.fade}>
            {
              currentChannels.length > 0 && currentChannels.map((channelObj, index) => {
                const channel = Object.prototype.hasOwnProperty.call(channelObj, 'channel') ? channelObj.channel : channelObj
                return (
                  <li key={index} className={styles.channel} onClick={() => openContactModal(channelObj)}>
                    <span>{displayNodeName(channel)}</span>
                    <span className={`${styles[channelStatus(channelObj)]} hint--left`} data-hint={channelStatus(channelObj)}>
                      <FaCircle />
                    </span>
                  </li>
                )
              })
            }
          </ul>
        </div>

        <footer className={styles.search}>
          <label htmlFor='search' className={`${styles.label} ${styles.input}`}>
            <Isvg src={search} />
          </label>
          <input
            id='search'
            type='text'
            className={`${styles.text} ${styles.input}`}
            placeholder='search by alias or pubkey'
            value={searchQuery}
            onChange={event => updateChannelSearchQuery(event.target.value)}
          />
        </footer>
      </div>
    )
  }
}

Network.propTypes = {
  currentChannels: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  nonActiveFilters: PropTypes.array.isRequired,

  channels: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  currentTicker: PropTypes.object.isRequired,

  fetchChannels: PropTypes.func.isRequired,
  openContactsForm: PropTypes.func.isRequired,
  toggleFilterPulldown: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  openContactModal: PropTypes.func.isRequired
}

export default Network
