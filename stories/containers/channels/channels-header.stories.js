import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import { ChannelsHeader } from 'components/Channels'
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
              const channelBalance = number('Channel', 2343455)
              const channels = [
                {
                  key: 1
                },
                {
                  key: 2
                },
                {
                  key: 3
                }
              ]
              return <ChannelsHeader channels={channels} channelBalance={channelBalance} />
            }
          }
        ]
      }
    ]
  })
