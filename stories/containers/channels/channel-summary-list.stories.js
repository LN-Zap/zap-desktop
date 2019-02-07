import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ChannelSummaryList } from 'components/Channels'
import { Provider } from '../../Provider'

const channels = [
  {
    chan_id: 1,
    display_name: 'Spudnik',
    display_id: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    remote_pubkey_short: '03cf5a37ed',
    local_balance: 686679,
    remote_balance: 75000,
    status: 'open',
    isAvailable: true
  },
  {
    chan_id: 2,
    display_name: '😋 Extra-Terrestrial Waste Collection Technology 😋',
    display_id: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    remote_pubkey_short: '03cf5a37ed',
    local_balance: 1000,
    remote_balance: 10909,
    status: 'open',
    isAvailable: true
  },
  {
    chan_id: 3,
    display_name: 'Mechanized Diplomacy Emulator',
    display_id: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    remote_pubkey_short: '0228e4b5e0',
    local_balance: 48887,
    remote_balance: 89987,
    status: 'loading',
    isAvailable: false
  },
  {
    // chan_id: 4,
    display_name: 'Sparky',
    display_id: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    remote_pubkey_short: '03cf5a37ed',
    local_balance: 686679,
    remote_balance: 75000,
    status: 'pending_open',
    isAvailable: false
  },
  {
    // chan_id: 5,
    display_name: 'Scyther',
    display_id: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    remote_pubkey_short: '0258f227eb',
    local_balance: 345,
    remote_balance: 5607,
    status: 'pending_close',
    isAvailable: false
  },
  {
    // chan_id: 6,
    display_name: null,
    display_id: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    remote_pubkey_short: '0258f227eb',
    local_balance: 1345,
    remote_balance: 65435,
    status: 'pending_force_close',
    isAvailable: false
  },
  {
    // chan_id: 7,
    display_name: 'Tobor',
    display_id: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    remote_pubkey_short: '0258f227eb',
    local_balance: 6932868,
    remote_balance: 4346674,
    status: 'waiting_close',
    isAvailable: false
  },
  {
    chan_id: 8,
    display_name: null,
    display_id: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    remote_pubkey_short: '0258f227eb',
    local_balance: 4677,
    remote_balance: 465,
    status: 'offline',
    isAvailable: false
  }
]

const showChannelDetail = action('showChannelDetail')

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelSummaryList', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const dispatchProps = {
                showChannelDetail
              }

              return <ChannelSummaryList channels={channels} {...dispatchProps} />
            }
          }
        ]
      }
    ]
  })
