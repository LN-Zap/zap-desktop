import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FaExternalLink from 'react-icons/lib/fa/external-link'
import FaCircle from 'react-icons/lib/fa/circle'
import FaRepeat from 'react-icons/lib/fa/repeat'
import FaAngleDown from 'react-icons/lib/fa/angle-down'
import { btc, blockExplorer } from 'lib/utils'
import Plus from 'components/Icon/Plus'
import Search from 'components/Icon/Search'
import { BackgroundLight, Text } from 'components/UI'
import Value from 'components/Value'

import { FormattedNumber, FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'

import SuggestedNodes from '../SuggestedNodes'

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
        filter,
        selectedChannel,
        loadingChannelPubkeys,
        closingChannelIds,
        channels,
        pendingChannels: { pending_open_channels }
      },
      currentChannels,
      balance,
      ticker,
      currentTicker,

      nodes,

      fetchChannels,
      openContactsForm,

      nonActiveFilters,
      toggleFilterPulldown,
      changeFilter,

      updateChannelSearchQuery,

      setSelectedChannel,

      closeChannel,

      suggestedNodesProps,

      network,

      currencyName,
      intl
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

    // when the user clicks the action to close the channel
    const removeClicked = removeChannel => {
      closeChannel({
        channel_point: removeChannel.channel_point,
        chan_id: removeChannel.chan_id,
        force: !removeChannel.active
      })
    }

    // when a user clicks a channel
    const channelClicked = clickedChannel => {
      // selectedChannel === channel ? setSelectedChannel(null) : setSelectedChannel(channel)
      if (selectedChannel === clickedChannel) {
        setSelectedChannel(null)
      } else {
        setSelectedChannel(clickedChannel)
      }
    }

    const displayNodeName = displayedChannel => {
      // due to inconsistent API vals the remote nodes pubkey will be under remote_pubkey for active channels and
      // remote_node_pub for closing channels. remote_node_pubkey gets the remote pubkey depending on what type of
      // channel we have
      const remote_node_pubkey = displayedChannel.remote_pubkey || displayedChannel.remote_node_pub

      const node = nodes.find(n => n.pub_key === remote_node_pubkey)

      if (node && node.alias.length) {
        return node.alias
      }

      return displayedChannel.remote_pubkey
        ? displayedChannel.remote_pubkey.substring(0, 10)
        : displayedChannel.remote_node_pub.substring(0, 10)
    }

    const channelStatus = statusChannel => {
      // if the channel has a confirmation_height property that means it's pending
      if (Object.prototype.hasOwnProperty.call(statusChannel, 'confirmation_height')) {
        return 'pending'
      }

      // if the channel has a closing tx that means it's closing
      if (Object.prototype.hasOwnProperty.call(statusChannel, 'closing_txid')) {
        return 'closing'
      }

      // if the channel is in waiting_close_channels phase
      if (Object.prototype.hasOwnProperty.call(statusChannel, 'limbo_balance')) {
        return 'closing'
      }

      // if we are in the process of closing this channel
      if (closingChannelIds.includes(statusChannel.chan_id)) {
        return 'closing'
      }

      // if the channel isn't active that means the remote peer isn't online
      if (!statusChannel.active) {
        return 'offline'
      }

      // if all of the above conditionals fail we can assume the node is online :)
      return 'online'
    }

    const fiatAmount = btc.satoshisToFiat(
      balance.channelBalance,
      currentTicker[ticker.fiatTicker].last
    )
    const { refreshing } = this.state
    return (
      <BackgroundLight className={styles.network}>
        <header className={styles.header}>
          <section>
            <h2>
              <FormattedMessage {...messages.title} />
            </h2>
            <span className={styles.channelAmount}>
              {Boolean(balance.channelBalance) && (
                <span>
                  <Value
                    value={balance.channelBalance}
                    currency={ticker.currency}
                    currentTicker={currentTicker}
                    fiatTicker={ticker.fiatTicker}
                  />
                  <i> {currencyName}</i>
                </span>
              )}
              {Boolean(fiatAmount) && (
                <span>
                  {' ≈ '}
                  <FormattedNumber
                    currency={ticker.fiatTicker}
                    style="currency"
                    value={fiatAmount}
                  />
                </span>
              )}
            </span>
          </section>
          <section
            className={`${styles.addChannel} hint--bottom-left`}
            onClick={openContactsForm}
            data-hint={intl.formatMessage({ ...messages.open_channel })}
          >
            <Text fontSize="xl">
              <Plus />
            </Text>
          </section>
        </header>

        <div className={styles.channels}>
          {loadingChannelPubkeys.length || pending_open_channels.length || channels.length ? (
            <header className={styles.listHeader}>
              <section>
                <h2 onClick={toggleFilterPulldown} className={styles.filterTitle}>
                  {filter.name}{' '}
                  <span className={filterPulldown ? styles.pulldown : undefined}>
                    <FaAngleDown />
                  </span>
                </h2>
                <ul className={`${styles.filters} ${filterPulldown ? styles.active : undefined}`}>
                  {nonActiveFilters.map(f => (
                    <li key={f.key} onClick={() => changeFilter(f)}>
                      {f.name}
                    </li>
                  ))}
                </ul>
              </section>
              <section className={styles.refreshContainer}>
                <span
                  className={styles.refresh}
                  onClick={refreshClicked}
                  ref={ref => {
                    this.repeat = ref
                  }}
                >
                  {refreshing ? <FaRepeat /> : <FormattedMessage {...messages.refresh} />}
                </span>
              </section>
            </header>
          ) : (
            <SuggestedNodes {...suggestedNodesProps} />
          )}

          <ul className={filterPulldown ? styles.fade : undefined}>
            {loadingChannelPubkeys.length > 0 &&
              loadingChannelPubkeys.map(loadingPubkey => {
                // TODO(jimmymow): refactor this out. same logic is in displayNodeName above
                const node = nodes.find(n => loadingPubkey === n.pub_key)
                const nodeDisplay = () => {
                  if (node && node.alias.length) {
                    return node.alias
                  }

                  return loadingPubkey.substring(0, 10)
                }

                return (
                  <li key={loadingPubkey} className={styles.channel}>
                    <section className={styles.channelTitle}>
                      <span
                        className={`${styles.loading} hint--right`}
                        data-hint={intl.formatMessage({ ...messages.loading })}
                      >
                        <i className={styles.spinner} />
                      </span>
                      <span>{nodeDisplay()}</span>
                    </section>
                  </li>
                )
              })}
            {currentChannels.length > 0 &&
              currentChannels.map((channelObj, index) => {
                const channel = Object.prototype.hasOwnProperty.call(channelObj, 'channel')
                  ? channelObj.channel
                  : channelObj
                const pubkey = channel.remote_node_pub || channel.remote_pubkey

                return (
                  <li
                    key={index}
                    className={`${styles.channel} ${
                      selectedChannel === channel ? styles.selectedChannel : undefined
                    }`}
                    onClick={() => channelClicked(channel)}
                  >
                    <section className={styles.channelTitle}>
                      <span
                        className={`${styles[channelStatus(channelObj)]} hint--right`}
                        data-hint={intl.formatMessage({ ...messages[channelStatus(channelObj)] })}
                      >
                        {closingChannelIds.includes(channel.chan_id) ? (
                          <span className={styles.loading}>
                            <i className={`${styles.spinner} ${styles.closing}`} />
                          </span>
                        ) : (
                          <FaCircle />
                        )}
                      </span>
                      <span>{displayNodeName(channel)}</span>
                      {selectedChannel === channel && (
                        <span
                          onClick={() =>
                            blockExplorer.showTransaction(
                              network,
                              channelObj.closing_txid || channel.channel_point.split(':')[0]
                            )
                          }
                        >
                          <FaExternalLink />
                        </span>
                      )}
                    </section>

                    <section className={styles.channelDetails}>
                      <header>
                        <h4>{`${pubkey.substring(0, 30)}...`}</h4>
                      </header>

                      <div className={styles.limits}>
                        <section>
                          <h5>
                            <FormattedMessage {...messages.pay_limit} />
                          </h5>
                          <p>
                            <Value
                              value={channel.local_balance}
                              currency={ticker.currency}
                              currentTicker={currentTicker}
                              fiatTicker={ticker.fiatTicker}
                            />
                            <i> {currencyName}</i>
                          </p>
                        </section>
                        <section>
                          <h5>
                            <FormattedMessage {...messages.req_limit} />
                          </h5>
                          <p>
                            <Value
                              value={channel.remote_balance}
                              currency={ticker.currency}
                              currentTicker={currentTicker}
                              fiatTicker={ticker.fiatTicker}
                            />
                            <i> {currencyName}</i>
                          </p>
                        </section>
                      </div>
                      <div className={styles.actions}>
                        {closingChannelIds.includes(channel.chan_id) && (
                          <section>
                            <span
                              className={`${styles.loading} hint--right`}
                              data-hint={intl.formatMessage({ ...messages.closing })}
                            >
                              <i>Closing</i> <i className={`${styles.spinner} ${styles.closing}`} />
                            </span>
                          </section>
                        )}
                        {Object.prototype.hasOwnProperty.call(channel, 'active') &&
                          !closingChannelIds.includes(channel.chan_id) && (
                            <section onClick={() => removeClicked(channel)}>
                              <div>Disconnect</div>
                            </section>
                          )}
                      </div>
                    </section>
                  </li>
                )
              })}
          </ul>
        </div>
        {(loadingChannelPubkeys.length || pending_open_channels.length || channels.length) && (
          <footer className={styles.search}>
            <label htmlFor="search" className={`${styles.label} ${styles.input}`}>
              <Search />
            </label>
            <input
              id="search"
              type="text"
              className={`${styles.text} ${styles.input}`}
              placeholder={intl.formatMessage({ ...messages.search_placeholder })}
              value={searchQuery}
              onChange={event => updateChannelSearchQuery(event.target.value)}
            />
          </footer>
        )}
      </BackgroundLight>
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
  ticker: PropTypes.object.isRequired,
  suggestedNodesProps: PropTypes.object.isRequired,

  network: PropTypes.object.isRequired,

  fetchChannels: PropTypes.func.isRequired,
  openContactsForm: PropTypes.func.isRequired,
  toggleFilterPulldown: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  closeChannel: PropTypes.func.isRequired,

  currencyName: PropTypes.string.isRequired
}

export default injectIntl(Network)
