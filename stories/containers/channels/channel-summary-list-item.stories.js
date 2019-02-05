import React from 'react'
import { storiesOf } from '@storybook/react'
import { number, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { ChannelSummaryListItem } from 'components/Channels'
import { Provider } from '../../Provider'

const showChannelDetail = action('showChannelDetail')

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelSummaryListItem', {
    chapters: [
      {
        sections: [
          {
            title: 'Node with alias',
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              const channelName = 'lnd1.zaphq.io'
              const channelId = '123'
              const channelPubKey =
                '0228e4b5e00a05f400411a0b556fa0fd4d7609555dc687bebb9b70419aff15cc3e'
              const channelPubKeyShort = '0228e4b5e0'

              const groupId1 = 'Node with alias'
              const localBalance1 = number('Local Balance 1', 150400, {}, groupId1)
              const remoteBalance1 = number('Remote Balance 1', 80044, {}, groupId1)
              const status1 = select(
                'Status 1',
                [
                  'open',
                  'pending_open',
                  'open',
                  'pending_close',
                  'pending_force_close',
                  'waiting_close',
                  'offline'
                ],
                'open',
                groupId1
              )

              const stateProps = {
                channelId,
                channelName,
                channelPubKey,
                channelPubKeyShort,
                localBalance: localBalance1,
                remoteBalance: remoteBalance1,
                status: status1
              }

              const dispatchProps = {
                showChannelDetail
              }

              return <ChannelSummaryListItem key={channelId} {...stateProps} {...dispatchProps} />
            }
          },
          {
            title: 'Node without alias',
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              const channelName = ''
              const channelId = '456'
              const channelPubKey =
                '4ab79fd8b15c53ddb19307826c74a030171377ee7fea9f6fb5f27c06ab163853'
              const channelPubKeyShort = '4ab79fd8b1'

              const groupId2 = 'Node without alias'
              const localBalance2 = number('Local Balance 2', 1856825, {}, groupId2)
              const remoteBalance2 = number('Remote Balance 2', 6862382, {}, groupId2)
              const status2 = select(
                'Status 2',
                [
                  'open',
                  'pending_open',
                  'open',
                  'pending_close',
                  'pending_force_close',
                  'waiting_close',
                  'offline'
                ],
                'pending_close',
                groupId2
              )

              const stateProps = {
                channelId,
                channelName,
                channelPubKey,
                channelPubKeyShort,
                localBalance: localBalance2,
                remoteBalance: remoteBalance2,
                status: status2
              }

              const dispatchProps = {
                showChannelDetail
              }

              return <ChannelSummaryListItem key={channelId} {...stateProps} {...dispatchProps} />
            }
          }
        ]
      }
    ]
  })
