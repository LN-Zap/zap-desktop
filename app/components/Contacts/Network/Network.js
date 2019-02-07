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
import X from 'components/Icon/X'
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

  setFormApi = formApi => {
    this.formApi = formApi
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
      searchQuery,
      ticker,
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
      if (selectedChannel && selectedChannel.channel_point === clickedChannel.channel_point) {
        setSelectedChannel(null)
      } else {
        setSelectedChannel(clickedChannel)
      }
    }

    const fiatAmount = satoshisToFiat(channelBalance || 0, currentTicker[ticker.fiatTicker])
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
                value={channelBalance || 0}
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
              <Dropdown activeKey={filter} items={filters} onChange={changeFilter} />
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
                currentChannels.map(channelObj => {
                  // If this is a pending channel, the channel data will be stored under the `channel` key.
                  const channel = channelObj.channel || channelObj
                  const {
                    display_name,
                    display_status,
                    chan_id,
                    closing_txid,
                    channel_point,
                    local_balance,
                    remote_balance
                  } = channel
                  const isSelected =
                    selectedChannel && selectedChannel.channel_point === channel.channel_point

                  return (
                    <Box
                      key={channel_point}
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
                          data-hint={intl.formatMessage({ ...messages[display_status] })}
                        >
                          <StatusIndicator variant={display_status} />
                        </Box>
                        <Text css={{ '&:hover': { opacity: 0.5 } }}>{display_name}</Text>
                        {isSelected && (
                          <Button
                            variant="secondary"
                            size="small"
                            ml="auto"
                            px={0}
                            py={0}
                            onClick={() =>
                              blockExplorer.showTransaction(
                                networkInfo,
                                closing_txid || channel_point.split(':')[0]
                              )
                            }
                          >
                            <ExternalLink />
                          </Button>
                        )}
                      </Flex>

                      {isSelected && (
                        <Box as="section" py={2} bg={isSelected ? 'secondaryColor' : null}>
                          <Text color="gray" fontSize="s" mx={3}>
                            {display_name}
                          </Text>

                          <Bar borderColor="primaryColor" borderBottom={2} my={3} />

                          <Flex justifyContent="space-between">
                            <Flex width={1 / 2} flexDirection="column" alignItems="center">
                              <Text fontWeight="normal">
                                <FormattedMessage {...messages.pay_limit} />
                              </Text>
                              <Text fontSize="s">
                                <Value
                                  value={local_balance}
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
                                  value={remote_balance}
                                  currency={ticker.currency}
                                  currentTicker={currentTicker}
                                  fiatTicker={ticker.fiatTicker}
                                />
                                <i> {currencyName}</i>
                              </Text>
                            </Flex>
                          </Flex>

                          {closingChannelIds.includes(chan_id) && (
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
                          {['online', 'offline'].includes(display_status) &&
                            !closingChannelIds.includes(chan_id) && (
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
                                      display_status === 'online'
                                        ? 'channel_close'
                                        : 'channel_force_close'
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
              <Form width={1} getApi={this.setFormApi}>
                {({ formState }) => (
                  <Flex alignItems="center">
                    <Text fontSize="l" css={{ opacity: 0.5 }} mt={2}>
                      <Search />
                    </Text>
                    <Input
                      field="search"
                      id="search"
                      type="text"
                      variant="thin"
                      border={0}
                      placeholder={intl.formatMessage({ ...messages.search_placeholder })}
                      initialValue={searchQuery}
                      onValueChange={this.onSearchTextChange}
                      width={1}
                    />
                    {formState.values.search && (
                      <Button
                        variant="secondary"
                        size="small"
                        type="button"
                        onClick={this.clearSearchQuery}
                      >
                        <X />
                      </Button>
                    )}
                  </Flex>
                )}
              </Form>
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
  channelBalance: PropTypes.number,
  currentTicker: PropTypes.object,
  searchQuery: PropTypes.string,
  ticker: PropTypes.object.isRequired,
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
