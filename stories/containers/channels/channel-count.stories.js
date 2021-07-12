import React from 'react'

import { storiesOf } from '@storybook/react'

import { ChannelCount } from 'components/Channels'

import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelCount', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              return <ChannelCount count={5} totalCount={10} />
            },
          },
        ],
      },
    ],
  })
