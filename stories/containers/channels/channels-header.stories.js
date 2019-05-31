import React from 'react'
import { storiesOf } from '@storybook/react'
import ChannelsHeader from 'containers/Channels/ChannelsHeader'
import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelsHeader', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const channels = [
                {
                  key: 1,
                },
                {
                  key: 2,
                },
                {
                  key: 3,
                },
              ]
              return <ChannelsHeader channels={channels} />
            },
          },
        ],
      },
    ],
  })
