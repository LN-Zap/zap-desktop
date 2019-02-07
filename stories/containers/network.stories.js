import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { MainContent, Sidebar } from 'components/UI'
import Network from 'components/Contacts/Network'
import { channelsSelectors } from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'
import { Provider, store } from '../Provider'
import { Window } from '../helpers'

const channelData = [
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
const pendingChannels = {
  total_limbo_balance: '',
  pending_open_channels: [],
  pending_closing_channels: [],
  pending_force_closing_channels: [],
  waiting_close_channels: []
}

store.dispatch({ type: 'RECEIVE_CHANNELS', channels: channelData, pendingChannels })

storiesOf('Containers.Network', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Network', () => {
    const dispatchProps = {
      fetchChannels: action('fetchChannels'),
      openContactsForm: action('openContactsForm'),
      changeFilter: action('changeFilter'),
      updateChannelSearchQuery: action('updateChannelSearchQuery'),
      setSelectedChannel: action('setSelectedChannel'),
      closeChannel: action('closeChannel'),
      openSubmitChannelForm: action('openSubmitChannelForm'),
      setNode: action('setNode')
    }
    const state = store.getState()

    return (
      <>
        <MainContent />
        <Sidebar.medium>
          <Network
            {...dispatchProps}
            currentChannels={channelsSelectors.currentChannels(state)}
            nodes={[]}
            channels={state.channels}
            currentTicker={tickerSelectors.currentTicker(state)}
            currencyName={tickerSelectors.currencyName(state)}
            networkInfo={infoSelectors.networkInfo(state)}
          />
        </Sidebar.medium>
      </>
    )
  })
