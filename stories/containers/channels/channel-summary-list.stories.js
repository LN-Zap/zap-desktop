import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { ChannelSummaryList } from 'components/Channels'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'

import { Window } from '../../helpers'
import { store, Provider } from '../../Provider'

const channels = [
  {
    chanId: 0,
    displayName: 'BeBop',
    displayPubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    localBalance: 686679,
    remoteBalance: 0,
    displayStatus: 'loading',
    active: false,
  },
  {
    chanId: 1,
    displayName: 'Spudnik',
    displayPubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    channelPoint: 'fd2cdfefbff293e74d4d76e153615eafe139ade56f5ac00c3ede6b28a5f787ce:0',
    localBalance: 686679,
    remoteBalance: 75000,
    displayStatus: 'open',
    active: true,
  },
  {
    chanId: 2,
    displayName: '😋 Extra-Terrestrial Waste Collection Technology 😋',
    displayPubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    channelPoint: '75e44940748428ef024ece2dc3e1dbd1967158f7f642bad1a6ad583216261350:1',
    localBalance: 1000,
    remoteBalance: 10909,
    displayStatus: 'open',
    active: true,
  },
  {
    chanId: 3,
    displayName: 'Mechanized Diplomacy Emulator',
    displayPubkey: '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e',
    channelPoint: '35c4fecc55baad798ac8ec9e9aa83a16a2c12a932641c41ae1fa1a25475b2765:1',
    localBalance: 48887,
    remoteBalance: 89987,
    displayStatus: 'loading',
    active: false,
  },
  {
    // chanId: 4,
    displayName: 'Sparky',
    displayPubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
    channelPoint: 'e70176efcfc703bdaf4092804f826888d2873ba301ae5582b22f5b9b42e36e50:1',
    localBalance: 686679,
    remoteBalance: 75000,
    displayStatus: 'pendingOpen',
    active: false,
  },
  {
    // chanId: 5,
    displayName: 'Scyther',
    displayPubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channelPoint: 'a3ad3cc4fdb13867d4d390ce563aca14585bd57822d3c5bb9f50caf390c01647:0',
    localBalance: 345,
    remoteBalance: 5607,
    displayStatus: 'pendingClose',
    active: false,
  },
  {
    // chanId: 6,
    displayName: '0258f227eb',
    displayPubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channelPoint: 'b09855a259c01d29e6a13a0e742c10f3d02cce632c7bcd38775d70ed90667371:0',
    localBalance: 1345,
    remoteBalance: 65435,
    displayStatus: 'pendingForceClose',
    active: false,
  },
  {
    // chanId: 7,
    displayName: 'Tobor',
    displayPubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channelPoint: '591c9ea46a5bd3fb674177e82de5f7e8b6e8aa694d892af3253d90d100a352bd:1',
    localBalance: 6932868,
    remoteBalance: 4346674,
    displayStatus: 'waitingClose',
    active: false,
  },
  {
    chanId: 8,
    displayName: '83c2839a48',
    displayPubkey: '0258f227eb1ab11f70bb0749fb016cd818154d8b0b6cec303165958650febd8700',
    channelPoint: '7078ebcacf0a01d379775dae783473ea4c88132565e9145b27d818d3c750bb3d:1',
    localBalance: 4677,
    remoteBalance: 465,
    displayStatus: 'offline',
    active: false,
  },
]

const setSelectedChannel = action('setSelectedChannel')
const openModal = action('openModal')

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelSummaryList', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const state = store.getState()
              const stateProps = {
                channels,
                networkInfo: infoSelectors.networkInfo(state),
                cryptoUnitName: tickerSelectors.cryptoUnitName(state),
              }

              const dispatchProps = {
                setSelectedChannel,
                openModal,
              }

              return (
                <Window>
                  <ChannelSummaryList {...stateProps} {...dispatchProps} />
                </Window>
              )
            },
          },
        ],
      },
    ],
  })
