import React from 'react'

import { storiesOf } from '@storybook/react'

import ChannelsHeader from 'containers/Channels/ChannelsHeader'

import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelsHeader', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => <ChannelsHeader currentChannelCount={3} />,
          },
        ],
      },
    ],
  })
