import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { State, Store } from '@sambego/storybook-state'
import { MainContent, Page, Sidebar } from 'components/UI'
import Network from 'components/Contacts/Network'

const channels = [
  {
    chan_id: 1,
    pubKey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_pubkey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_node_pub: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    local_balance: 167000,
    remote_balance: 13856,
    active: true
  },
  {
    chan_id: 2,
    pubKey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_pubkey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_node_pub: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    local_balance: 1000,
    remote_balance: 50
  },
  {
    chan_id: 3,
    pubKey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_pubkey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_node_pub: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    local_balance: 6457634,
    remote_balance: 3445
  },
  {
    chan_id: 4,
    pubKey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_pubkey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_node_pub: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    local_balance: 664,
    remote_balance: 32,
    active: true
  }
]

const loadingChannelPubkeys = ['0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e']

storiesOf('Containers.Network', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .add('Network', () => {
    const store = new Store({
      currencyName: 'btc',
      channels: {
        searchQuery: '',
        filter: { key: 'ALL_CHANNELS', name: 'All' },
        filters: [
          { key: 'ALL_CHANNELS', name: 'All' },
          { key: 'ACTIVE_CHANNELS', name: 'Online' },
          { key: 'NON_ACTIVE_CHANNELS', name: 'Offline' },
          { key: 'OPEN_PENDING_CHANNELS', name: 'Pending' },
          { key: 'CLOSING_PENDING_CHANNELS', name: 'Closing' }
        ],
        selectedChannel: null,
        loadingChannelPubkeys,
        closingChannelIds: [3],
        channels,
        pendingChannels: {
          pending_open_channels: []
        }
      },
      networkLoading: false,
      nodes: [],
      edges: [],
      selectedNode: {},
      currentTab: 1,
      currentPeer: {},
      currentRoute: {},
      fetchingInvoiceAndQueryingRoutes: false,
      pay_req: '',
      payReqRoutes: [],
      selectedPeers: [],
      currentChannels: channels,
      balance: {
        channelBalance: 1000
      },
      currentTicker: {
        USD: 6477.78,
        EUR: 5656.01,
        GBP: 5052.73
      },
      ticker: {
        currency: 'btc',
        fiatTicker: 'USD'
      },
      suggestedNodesProps: {
        suggestedNodesLoading: false,
        suggestedNodes: [
          {
            pubkey: '03e50492eab4107a773141bb419e107bda3de3d55652e6e1a41225f06a0bbf2d56',
            host: 'mainnet-lnd.yalls.org',
            nickname: 'Yalls',
            description:
              'Top up prepaid mobile phones with bitcoin and altcoins in USA and around the world'
          },
          {
            pubkey: '024655b768ef40951b20053a5c4b951606d4d86085d51238f2c67c7dec29c792ca',
            host: '88.98.213.235',
            nickname: 'Satoshis Place',
            description: 'Pay per pixel'
          },
          {
            pubkey: '0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b',
            host: '159.203.125.125',
            nickname: 'Lightning Faucet',
            description: 'Lightning Network Faucet'
          }
        ],
        setNode: action('setNode'),
        openSubmitChannelForm: action('openSubmitChannelForm')
      },
      network: {}
    })
    const dispatchProps = {
      fetchChannels: action('fetchChannels'),
      openContactsForm: action('openContactsForm'),
      changeFilter: filter => {
        console.log('changeFilter', filter)
        const channels = store.get('channels')
        channels.filter = filter
        store.set({ channels })
      },
      updateChannelSearchQuery: action('updateChannelSearchQuery'),
      setSelectedChannel: selectedChannel => {
        console.log('setSelectedChannel', selectedChannel)
        const channels = store.get('channels')
        channels.selectedChannel = selectedChannel
        store.set({ channels })
      },
      closeChannel: action('closeChannel')
    }

    const hasChannels = boolean('Has channels', true)
    const suggestedNodesLoading = boolean('Is loading', false)

    return (
      <Page>
        <MainContent />
        <Sidebar.medium>
          <State store={store}>
            {state => {
              if (hasChannels) {
                state.currentChannels = channels
                state.channels.channels = channels
                state.channels.loadingChannelPubkeys = loadingChannelPubkeys
              } else {
                state.currentChannels = []
                state.channels.channels = []
                state.channels.loadingChannelPubkeys = []
              }
              if (suggestedNodesLoading) {
                state.suggestedNodesProps.suggestedNodesLoading = true
              }
              return <Network {...dispatchProps} {...state} />
            }}
          </State>
        </Sidebar.medium>
      </Page>
    )
  })
