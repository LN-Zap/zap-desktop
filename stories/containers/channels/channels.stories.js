import React from 'react'

import { storiesOf } from '@storybook/react'

import Channels from 'containers/Channels'

import { Window } from '../../helpers'
import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('Channels', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => (
              <Window>
                <Channels width={1} />
              </Window>
            ),
          },
        ],
      },
    ],
  })
