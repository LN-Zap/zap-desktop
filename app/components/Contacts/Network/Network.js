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
    refreshing: false
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

  onSearchTextChange = value => {
    this.updateChannelSearchQuery(value)
  }

  clearSearchQuery = () => {
    this.updateChannelSearchQuery(null)
    this.formApi.setValue('search', '')
  }

  clearRefreshing = () => {
    this.setState({ refreshing: false })
  }

  render() {
    const {
      channels: {
        filter,
        filters,
        selectedChannelId,
        loadingChannelPubkeys,
        closingChannelIds,
        channels,
        pendingChannels: { pending_open_channels }
      },
      currentChannels,
      channelBalance,
      searchQuery,
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

    if (!currentTicker || !currencyName || !networkInfo) {
      return null
    }

    const refreshClicked = () => {
      this.setState({ refreshing: true })
      fetchChannels()
    }

    // when the user clicks the action to close the channel
    const removeClicked = removeChannel => {
      const { channel_point, chan_id, active } = removeChannel
      closeChannel({ channel_point, chan_id, force: !active })
    }

    // when a user clicks a channel
    const channelClicked = clickedChannel => {
      if (selectedChannelId && selectedChannelId === clickedChannel.channel_point) {
        setSelectedChannel(null)
      } else {
        setSelectedChannel(clickedChannel.channel_point)
      }
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
            activeKey={filter}
            refreshClicked={refreshClicked}
            isRefreshing={refreshing}
            refreshMessage={messages.refresh}
            changeFilter={changeFilter}
          />
        </Panel.Header>

        <Panel.Body css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
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
                currentChannels.map(channelObj => {
                  // If this is a pending channel, the channel data will be stored under the `channel` key.
                  const channel = channelObj.channel || channelObj
                  const {
                    can_close,
                    display_name,
                    legacy_staus,
                    chan_id,
                    closing_txid,
                    channel_point,
                    local_balance,
                    remote_balance
                  } = channel
                  const isSelected = Boolean(
                    selectedChannelId && selectedChannelId === channel_point
                  )

                  return (
                    <Box
                      key={channel_point}
                      onClick={() => channelClicked(channel)}
                      bg={isSelected ? 'secondaryColor' : null}
                      pb={1}
                    >
                      <ChannelItem
                        statusTooltip={intl.formatMessage({ ...messages[legacy_staus] })}
                        status={legacy_staus}
                        name={display_name}
                        isSelected={isSelected}
                        onBrowseClick={() =>
                          blockExplorer.showTransaction(
                            networkInfo,
                            closing_txid || channel_point.split(':')[0]
                          )
                        }
                      />

                      {isSelected && (
                        <ChannelDetails
                          isClosing={closingChannelIds.includes(chan_id)}
                          canClose={can_close}
                          payLimitMsg={messages.pay_limit}
                          reqLimitMsg={messages.req_limit}
                          currencyName={currencyName}
                          localBalance={local_balance}
                          remoteBalance={remote_balance}
                          onRemoveClick={() => removeClicked(channel)}
                          closingMessage={messages.closing}
                          pubkey={display_name}
                          status={
                            messages[
                              legacy_staus === 'online' ? 'channel_close' : 'channel_force_close'
                            ]
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
  searchQuery: PropTypes.string,
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
