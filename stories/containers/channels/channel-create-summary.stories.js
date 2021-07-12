import React from 'react'

import { storiesOf } from '@storybook/react'

import { ChannelCreateSummary } from 'components/Channels'

import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelCreateSummary', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const stateProps = {
                amount: 1487005,
                fee: {
                  slow: 5,
                  medium: 50,
                  fast: 100,
                },
                speed: 'TRANSACTION_SPEED_SLOW',
                nodePubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
                nodeDisplayName: 'Sparky',
              }
              return <ChannelCreateSummary {...stateProps} />
            },
          },
        ],
      },
    ],
  })
