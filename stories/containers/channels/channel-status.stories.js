import React from 'react'
import { storiesOf } from '@storybook/react'
import { ChannelStatus } from 'components/Channels'

storiesOf('Containers.Channels', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .addWithChapters('ChannelStatus', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => <ChannelStatus status="loading" />
          },
          {
            sectionFn: () => <ChannelStatus status="pending_open" />
          },
          {
            sectionFn: () => <ChannelStatus status="open" />
          },
          {
            sectionFn: () => <ChannelStatus status="pending_close" />
          },
          {
            sectionFn: () => <ChannelStatus status="pending_force_close" />
          },
          {
            sectionFn: () => <ChannelStatus status="waiting_close" />
          },
          {
            sectionFn: () => <ChannelStatus status="offline" />
          }
        ]
      }
    ]
  })
