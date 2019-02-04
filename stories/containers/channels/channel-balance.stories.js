import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import { ChannelBalance } from 'components/Channels'
import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelBalance', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const channelBalance = number('Channel Balance', 1237474)
              return <ChannelBalance channelBalance={channelBalance} />
            }
          }
        ]
      }
    ]
  })
