import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { intlShape, injectIntl } from 'react-intl'
import { Box } from 'rebass'
import blockExplorer from 'lib/utils/blockExplorer'
import { Bar, Panel } from 'components/UI'
import SuggestedNodes from 'containers/Contacts/SuggestedNodes'
import messages from './messages'

import {
  Header,
  NetworkBalance,
  SearchBar,
  ChannelItem,
  ChannelDetails,
  NetworkActionBar,
  LoadingChannels
} from '.'

class Network extends Component {
  state = {
    refreshing: false,
    searchQuery: ''
  }

  /*eslint-disable react/destructuring-assignment*/
  updateChannelSearchQuery = debounce(this.props.updateChannelSearchQuery, 300)

  componentDidUpdate(prevProps) {
    const { refreshing } = this.state
    const { channels } = this.props
    if (refreshing && !channels.channelsLoading && prevProps.channels.channelsLoading) {
      this.clearRefreshing()
    }
  }

  onSearchTextChange = event => {
    const { value } = event.target
    this.setState({
      searchQuery: value
    })
    this.updateChannelSearchQuery(value)
  }

  clearRefreshing = () => {
    this.setState({ refreshing: false })
  }

  render() {
    const {
      channels: {
        filter,
        filters,
        selectedChannel,
        loadingChannelPubkeys,
        closingChannelIds,
        channels,
        pendingChannels: { pending_open_channels }
      },
      currentChannels,
      channelBalance,
      currentTicker,
      nodes,
      fetchChannels,
      openContactsForm,
      changeFilter,
      setSelectedChannel,
      closeChannel,
      networkInfo,
      currencyName,
      intl
    } = this.props

    const { searchQuery } = this.state

    if (!currentTicker || !currencyName || !networkInfo) {
      return null
    }

    const refreshClicked = () => {
      this.setState({ refreshing: true })
      fetchChannels()
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

      if (node && node.alias && node.alias.length) {
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

    const { refreshing } = this.state
    const hasChannels = Boolean(
      loadingChannelPubkeys.length || pending_open_channels.length || channels.length
    )

    return (
      <Panel pt={3}>
        <Panel.Header pt={2}>
          <Header
            title={messages.title}
            openContactsForm={openContactsForm}
            hint={intl.formatMessage({ ...messages.open_channel })}
          />

          <NetworkBalance currencyName={currencyName} channelBalance={channelBalance || 0} />

          <Bar my={3} borderColor="gray" css={{ opacity: 0.3 }} />

          <NetworkActionBar
            hasChannels={hasChannels}
            filters={filters}
            activeKey={filter.key}
            refreshClicked={refreshClicked}
            isRefreshing={refreshing}
            refreshMessage={messages.refresh}
            changeFilter={changeFilter}
          />
        </Panel.Header>

        <Panel.Body css={{ 'overflow-y': 'overlay' }}>
          {!hasChannels && <SuggestedNodes py={3} mx={3} />}

          {hasChannels && (
            <Box>
              {loadingChannelPubkeys.length > 0 &&
                loadingChannelPubkeys.map(loadingPubkey => {
                  const node = nodes.find(n => loadingPubkey === n.pub_key)
                  const nodeDisplay = () => {
                    if (node && node.alias.length) {
                      return node.alias
                    }

                    return loadingPubkey.substring(0, 10)
                  }

                  return (
                    <LoadingChannels
                      key={loadingPubkey}
                      message={intl.formatMessage({ ...messages.loading })}
                      name={nodeDisplay()}
                    />
                  )
                })}

              {currentChannels.length > 0 &&
                currentChannels.map((channelObj, index) => {
                  const channel = Object.prototype.hasOwnProperty.call(channelObj, 'channel')
                    ? channelObj.channel
                    : channelObj
                  const pubkey = channel.remote_node_pub || channel.remote_pubkey
                  const isSelected = selectedChannel === channel
                  const status = channelStatus(channelObj)

                  return (
                    <Box
                      key={index}
                      onClick={() => channelClicked(channel)}
                      bg={isSelected ? 'secondaryColor' : null}
                      pb={1}
                    >
                      <ChannelItem
                        statusTooltip={intl.formatMessage({ ...messages[status] })}
                        status={status}
                        name={displayNodeName(channel)}
                        isSelected={isSelected}
                        onBrowseClick={() =>
                          blockExplorer.showTransaction(
                            networkInfo,
                            channelObj.closing_txid || channel.channel_point.split(':')[0]
                          )
                        }
                      />

                      {isSelected && (
                        <ChannelDetails
                          isClosing={closingChannelIds.includes(channel.chan_id)}
                          canClose={
                            ['online', 'offline'].includes(status) &&
                            !closingChannelIds.includes(channel.chan_id)
                          }
                          payLimitMsg={messages.pay_limit}
                          reqLimitMsg={messages.req_limit}
                          currencyName={currencyName}
                          localBalance={channel.local_balance}
                          remoteBalance={channel.remote_balance}
                          onRemoveClick={() => removeClicked(channel)}
                          closingMessage={messages.closing}
                          pubkey={`${pubkey.substring(0, 30)}...`}
                          status={
                            messages[status === 'online' ? 'channel_close' : 'channel_force_close']
                          }
                        />
                      )}
                    </Box>
                  )
                })}
            </Box>
          )}
        </Panel.Body>

        {Boolean(
          loadingChannelPubkeys.length || pending_open_channels.length || channels.length
        ) && (
          <SearchBar
            searchQuery={searchQuery}
            placeholder={intl.formatMessage({ ...messages.search_placeholder })}
            onSearchQueryChanged={this.onSearchTextChange}
          />
        )}
      </Panel>
    )
  }
}

Network.propTypes = {
  intl: intlShape.isRequired,
  currentChannels: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  channels: PropTypes.object.isRequired,
  channelBalance: PropTypes.number,
  currentTicker: PropTypes.object,
  networkInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  fetchChannels: PropTypes.func.isRequired,
  openContactsForm: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  closeChannel: PropTypes.func.isRequired,
  currencyName: PropTypes.string
}

export default injectIntl(Network)
