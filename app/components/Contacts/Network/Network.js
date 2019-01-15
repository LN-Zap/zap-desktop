import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { FormattedNumber, FormattedMessage, injectIntl } from 'react-intl'
import { Box, Flex } from 'rebass'
import blockExplorer from 'lib/utils/blockExplorer'
import { satoshisToFiat } from 'lib/utils/btc'
import SuggestedNodes from 'containers/Contacts/SuggestedNodes'
import ExternalLink from 'components/Icon/ExternalLink'
import PlusCircle from 'components/Icon/PlusCircle'
import Search from 'components/Icon/Search'
import {
  Bar,
  Button,
  Dropdown,
  Form,
  Heading,
  Input,
  Panel,
  Spinner,
  StatusIndicator,
  Text,
  Value
} from 'components/UI'
import messages from './messages'

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
      balance,
      ticker,
      currentTicker,
      nodes,
      fetchChannels,
      openContactsForm,
      changeFilter,
      setSelectedChannel,
      closeChannel,
      network,
      currencyName,
      intl
    } = this.props

    const { searchQuery } = this.state

    if (!currentTicker || !currencyName) {
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

    const fiatAmount = satoshisToFiat(balance.channelBalance, currentTicker[ticker.fiatTicker])
    const { refreshing } = this.state
    const hasChannels = Boolean(
      loadingChannelPubkeys.length || pending_open_channels.length || channels.length
    )

    return (
      <Panel pt={3}>
        <Panel.Header pt={2}>
          <Flex justifyContent="space-between" mx={3}>
            <Heading.h4 fontWeight="normal" mb={3}>
              <FormattedMessage {...messages.title} />
            </Heading.h4>
            <Box
              onClick={openContactsForm}
              className="hint--right"
              data-hint={intl.formatMessage({ ...messages.open_channel })}
              css={{ cursor: 'pointer', '&:hover': { opacity: 0.5 } }}
              width={1 / 2}
            >
              <Text fontSize="22px" textAlign="right">
                <PlusCircle />
              </Text>
            </Box>
          </Flex>

          <Box mx={3}>
            <Text>
              <Value
                value={balance.channelBalance || 0}
                currency={ticker.currency}
                currentTicker={currentTicker}
                fiatTicker={ticker.fiatTicker}
              />
              <i> {currencyName}</i>
            </Text>
            <Text color="gray">
              {' ≈ '}
              <FormattedNumber
                currency={ticker.fiatTicker}
                style="currency"
                value={fiatAmount || 0}
              />
            </Text>
          </Box>

          <Bar my={3} borderColor="gray" css={{ opacity: 0.3 }} />

          {hasChannels && (
            <Flex justifyContent="space-between" alignItems="center" mx={3} mb={3}>
              <Dropdown
                activeKey={filter.key}
                items={filters}
                onChange={key => changeFilter(filters.find(f => f.key === key))}
              />
              <Button
                size="small"
                variant="secondary"
                onClick={refreshClicked}
                ref={ref => {
                  this.repeat = ref
                }}
              >
                {refreshing ? <Spinner /> : <FormattedMessage {...messages.refresh} />}
              </Button>
            </Flex>
          )}
        </Panel.Header>

        <Panel.Body css={{ 'overflow-y': 'auto' }}>
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
                    <Flex
                      as="header"
                      alignItems="center"
                      key={loadingPubkey}
                      py={2}
                      my={1}
                      mx={3}
                      css={{ cursor: 'pointer' }}
                    >
                      <Box
                        mr={2}
                        className="hint--right"
                        data-hint={intl.formatMessage({ ...messages.loading })}
                      >
                        <StatusIndicator variant="loading" />
                      </Box>
                      <Text>{nodeDisplay()}</Text>
                    </Flex>
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
                      <Flex
                        as="header"
                        alignItems="center"
                        py={2}
                        my={1}
                        mx={3}
                        css={{ cursor: 'pointer' }}
                      >
                        <Box
                          mr={2}
                          className="hint--right"
                          data-hint={intl.formatMessage({ ...messages[status] })}
                        >
                          <StatusIndicator variant={status} />
                        </Box>
                        <Text css={{ '&:hover': { opacity: 0.5 } }}>
                          {displayNodeName(channel)}
                        </Text>
                        {isSelected && (
                          <Button
                            variant="secondary"
                            size="small"
                            ml="auto"
                            px={0}
                            py={0}
                            onClick={() =>
                              blockExplorer.showTransaction(
                                network,
                                channelObj.closing_txid || channel.channel_point.split(':')[0]
                              )
                            }
                          >
                            <ExternalLink />
                          </Button>
                        )}
                      </Flex>

                      {isSelected && (
                        <Box as="section" py={2} bg={isSelected ? 'secondaryColor' : null}>
                          <Text color="gray" fontSize="s" mx={3}>{`${pubkey.substring(
                            0,
                            30
                          )}...`}</Text>

                          <Bar borderColor="primaryColor" borderBottom={2} my={3} />

                          <Flex justifyContent="space-between">
                            <Flex width={1 / 2} flexDirection="column" alignItems="center">
                              <Text fontWeight="normal">
                                <FormattedMessage {...messages.pay_limit} />
                              </Text>
                              <Text fontSize="s">
                                <Value
                                  value={channel.local_balance}
                                  currency={ticker.currency}
                                  currentTicker={currentTicker}
                                  fiatTicker={ticker.fiatTicker}
                                />
                                <i> {currencyName}</i>
                              </Text>
                            </Flex>
                            <Flex width={1 / 2} flexDirection="column" alignItems="center">
                              <Text fontWeight="normal">
                                <FormattedMessage {...messages.req_limit} />
                              </Text>
                              <Text fontSize="s">
                                <Value
                                  value={channel.remote_balance}
                                  currency={ticker.currency}
                                  currentTicker={currentTicker}
                                  fiatTicker={ticker.fiatTicker}
                                />
                                <i> {currencyName}</i>
                              </Text>
                            </Flex>
                          </Flex>

                          {closingChannelIds.includes(channel.chan_id) && (
                            <Box as="footer">
                              <Bar borderColor="primaryColor" borderBottom={2} my={3} />

                              <Flex
                                py={2}
                                color="lightningOrange"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Flex>
                                  <Spinner mr={2} />
                                  <FormattedMessage {...messages.closing} />
                                </Flex>
                              </Flex>
                            </Box>
                          )}
                          {['online', 'offline'].includes(status) &&
                            !closingChannelIds.includes(channel.chan_id) && (
                              <Box as="footer">
                                <Bar borderColor="primaryColor" borderBottom={2} my={3} />

                                <Text
                                  onClick={() => removeClicked(channel)}
                                  py={2}
                                  color="superRed"
                                  textAlign="center"
                                  css={{ cursor: 'pointer', '&:hover': { opacity: 0.5 } }}
                                >
                                  <FormattedMessage
                                    {...messages[
                                      status === 'online' ? 'channel_close' : 'channel_force_close'
                                    ]}
                                  />
                                </Text>
                              </Box>
                            )}
                        </Box>
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
          <>
            <Bar mt={3} borderColor="gray" css={{ opacity: 0.3 }} />
            <Panel.Footer as="footer" px={3} py={3}>
              <Flex alignItems="center" width={1}>
                <Text fontSize="l" css={{ opacity: 0.5 }} mt={2}>
                  {!searchQuery && <Search />}
                </Text>
                <Form width={1}>
                  <Input
                    field="search"
                    id="search"
                    type="text"
                    variant="thin"
                    border={0}
                    placeholder={intl.formatMessage({ ...messages.search_placeholder })}
                    value={searchQuery}
                    onChange={this.onSearchTextChange}
                  />
                </Form>
              </Flex>
            </Panel.Footer>
          </>
        )}
      </Panel>
    )
  }
}

Network.propTypes = {
  currentChannels: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  channels: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  currentTicker: PropTypes.object,
  ticker: PropTypes.object.isRequired,
  network: PropTypes.object.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  openContactsForm: PropTypes.func.isRequired,
  changeFilter: PropTypes.func.isRequired,
  updateChannelSearchQuery: PropTypes.func.isRequired,
  setSelectedChannel: PropTypes.func.isRequired,
  closeChannel: PropTypes.func.isRequired,
  currencyName: PropTypes.string
}

export default injectIntl(Network)
