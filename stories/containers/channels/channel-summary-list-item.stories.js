import React from 'react'
import { storiesOf } from '@storybook/react'
import { number, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { ChannelSummaryListItem } from 'components/Channels'
import { Provider } from '../../Provider'

const setSelectedChannel = action('setSelectedChannel')

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelSummaryListItem', {
    chapters: [
      {
        sections: [
          {
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              const channel = {
                chan_id: 1,
                display_name: 'lnd1.zaphq.io',
                display_pubkey:
                  '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
                channel_point: '83c2839a4831c71d501ea41bdb0c3e01284bdb5302b1d16c9c52a876bd3ea6a7:1',
                csv_delay: 2016,
                num_updates: 12,
                local_balance: number('Local Balance', 150400),
                remote_balance: number('Remote Balance', 80044),
                display_status: select(
                  'Status',
                  [
                    'open',
                    'pending_open',
                    'open',
                    'pending_close',
                    'pending_force_close',
                    'waiting_close',
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
