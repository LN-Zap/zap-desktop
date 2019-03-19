import React from 'react'
import { storiesOf } from '@storybook/react'
import { ChannelCount } from 'components/Channels'
import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelCount', {
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
              return <ChannelCount channels={channels} />
            },
          },
        ],
      },
    ],
  })
