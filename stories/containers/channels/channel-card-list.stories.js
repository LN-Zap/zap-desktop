import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'
import { ChannelCardList } from 'components/Channels'
import { Provider, store } from '../../Provider'

const channels = [
  {
    chan_id: 1,
    display_name: 'Spudnik',
    display_pubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    channel_point: 'fd2cdfefbff293e74d4d76e153615eafe139ade56f5ac00c3ede6b28a5f787ce:0',
    local_balance: 686679,
    remote_balance: 75000,
    display_status: 'open',
    active: true
  },
  {
    chan_id: 2,
    display_name: '😋 Extra-Terrestrial Waste Collection Technology 😋',
    display_pubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    channel_point: '75e44940748428ef024ece2dc3e1dbd1967158f7f642bad1a6ad583216261350:1',
    local_balance: 1000,
    remote_balance: 10909,
    display_status: 'open',
    active: true
  },
  {
    chan_id: 3,
    display_name: 'Mechanized Diplomacy Emulator',
    display_pubkey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    channel_point: '35c4fecc55baad798ac8ec9e9aa83a16a2c12a932641c41ae1fa1a25475b2765:1',
    local_balance: 48887,
    remote_balance: 89987,
    display_status: 'loading',
    active: false
  },
  {
    // chan_id: 4,
    display_name: 'Sparky',
    display_pubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    channel_point: 'e70176efcfc703bdaf4092804f826888d2873ba301ae5582b22f5b9b42e36e50:1',
    local_balance: 686679,
    remote_balance: 75000,
    display_status: 'pending_open',
    active: false
  },
  {
    // chan_id: 5,
    display_name: 'Scyther',
    display_pubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channel_point: 'a3ad3cc4fdb13867d4d390ce563aca14585bd57822d3c5bb9f50caf390c01647:0',
    local_balance: 345,
    remote_balance: 5607,
    display_status: 'pending_close',
    active: false
  },
  {
    // chan_id: 6,
    display_name: '0258f227eb',
    display_pubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channel_point: 'b09855a259c01d29e6a13a0e742c10f3d02cce632c7bcd38775d70ed90667371:0',
    local_balance: 1345,
    remote_balance: 65435,
    display_status: 'pending_force_close',
    active: false
  },
  {
    // chan_id: 7,
    display_name: 'Tobor',
    display_pubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channel_point: '591c9ea46a5bd3fb674177e82de5f7e8b6e8aa694d892af3253d90d100a352bd:1',
    local_balance: 6932868,
    remote_balance: 4346674,
    display_status: 'waiting_close',
    active: false
  },
  {
    chan_id: 8,
    display_name: '83c2839a48',
    display_pubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channel_point: '7078ebcacf0a01d379775dae783473ea4c88132565e9145b27d818d3c750bb3d:1',
    local_balance: 4677,
    remote_balance: 465,
    display_status: 'offline',
    active: false
  }
]

const setSelectedChannel = action('setSelectedChannel')

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelCardList', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const state = store.getState()
              const stateProps = {
                channels,
                networkInfo: infoSelectors.networkInfo(state),
                currencyName: tickerSelectors.currencyName(state)
              }
              const dispatchProps = {
                setSelectedChannel
              }

              return <ChannelCardList {...stateProps} {...dispatchProps} />
            }
          }
        ]
      }
    ]
  })
