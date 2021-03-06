import React from 'react'
import { storiesOf } from '@storybook/react'
import { number, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { ChannelSummaryListItem } from 'components/Channels'
import { Provider } from '../../Provider'

const setSelectedChannel = action('setSelectedChannel')

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelSummaryListItem', {
    chapters: [
      {
        sections: [
          {
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              const channel = {
                chanId: 1,
                displayName: 'lnd1.zaphq.io',
                displayPubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
                channelPoint: '83c2839a4831c71d501ea41bdb0c3e01284bdb5302b1d16c9c52a876bd3ea6a7:1',
                csvDelay: 2016,
                numUpdates: 12,
                localBalance: number('Local Balance', 150400),
                remoteBalance: number('Remote Balance', 80044),
                displayStatus: select(
                  'Status',
                  [
                    'open',
                    'pendingOpen',
                    'open',
                    'pendingClose',
                    'pendingForceClose',
                    'waitingClose',
                    'offline',
                  ],
                  'open'
                ),
                active: true,
              }

              const stateProps = {
                channel,
              }
              const dispatchProps = {
                setSelectedChannel,
              }

              return <ChannelSummaryListItem {...stateProps} {...dispatchProps} />
            },
          },
        ],
      },
    ],
  })
