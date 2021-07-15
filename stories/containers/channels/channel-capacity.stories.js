import React from 'react'

import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { ChannelCapacity } from 'components/Channels'

import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelCapacity', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const localBalance = number('Local Balance', 150000)
              const remoteBalance = number('Remote Balance', 75000)
              return <ChannelCapacity localBalance={localBalance} remoteBalance={remoteBalance} />
            },
          },
        ],
      },
    ],
  })
