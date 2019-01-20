import React from 'react'
import { storiesOf } from '@storybook/react'
import { number, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { infoSelectors } from 'reducers/info'
import { ChannelCardListItem } from 'components/Channels'
import { Provider, store } from '../../Provider'

const showChannelDetail = action('showChannelDetail')

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelCardListItem', {
    chapters: [
      {
        sections: [
          {
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              const channelName = 'lnd1.zaphq.io'
              const channelId = 123
              const channelPubKey =
                '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e'
              const channelFundingTxid =
                '83c2839a4831c71d501ea41bdb0c3e01284bdb5302b1d16c9c52a876bd3ea6a7'
              const numUpdates = 12
              const csvDelay = 2016
              const localBalance = number('Local Balance 1', 150400)
              const remoteBalance = number('Remote Balance 1', 80044)
              const status = select(
                'Status',
                [
                  'open',
                  'pending_open',
                  'open',
                  'pending_close',
                  'pending_force_close',
                  'waiting_close',
                  'offline'
                ],
                'open'
              )

              const stateProps = {
                channelId,
                channelName,
                channelPubKey,
                channelFundingTxid,
                numUpdates,
                csvDelay,
                localBalance,
                remoteBalance,
                status,
                isAvailable: status === 'open',
                networkInfo: infoSelectors.networkInfo(store.getState())
              }

              const dispatchProps = {
                showChannelDetail
              }

              return (
                <ChannelCardListItem
                  key={channelId}
                  {...stateProps}
                  {...dispatchProps}
                  width={0.5}
                />
              )
            }
          }
        ]
      }
    ]
  })
