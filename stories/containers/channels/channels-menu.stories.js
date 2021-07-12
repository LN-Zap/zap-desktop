import React from 'react'

import { storiesOf } from '@storybook/react'

import ChannelsMenu from 'containers/Channels/ChannelsMenu'

import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelsMenu', {
    chapters: [
      {
        sections: [
          {
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              return <ChannelsMenu width={265} />
            },
          },
        ],
      },
    ],
  })
