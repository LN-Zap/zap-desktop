import React from 'react'

import { storiesOf } from '@storybook/react'

import { ChannelStatus } from 'components/Channels'

storiesOf('Containers.Channels', module)
  .addParameters({
    info: {
      disable: true,
    },
  })
  .addWithChapters('ChannelStatus', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => <ChannelStatus status="loading" />,
          },
          {
            sectionFn: () => <ChannelStatus status="pendingOpen" />,
          },
          {
            sectionFn: () => <ChannelStatus status="open" />,
          },
          {
            sectionFn: () => <ChannelStatus status="pendingClose" />,
          },
          {
            sectionFn: () => <ChannelStatus status="pendingForceClose" />,
          },
          {
            sectionFn: () => <ChannelStatus status="waitingClose" />,
          },
          {
            sectionFn: () => <ChannelStatus status="offline" />,
          },
        ],
      },
    ],
  })
