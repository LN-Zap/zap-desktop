import React from 'react'
import { storiesOf } from '@storybook/react'
import { ChannelCreateSummary } from 'components/Channels'
import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('ChannelCreateSummary', {
    chapters: [
      {
        sections: [
          {
            sectionFn: () => {
              const stateProps = {
                amount: 1487005,
                fee: 88,
                speed: 'TRANSACTION_SPEED_SLOW',
                nodePubkey: '03cf5a37ed661e3c61c7943941834771631cd880985340ed7543ad79a968cea454',
                nodeDisplayName: 'Sparky'
              }
              return <ChannelCreateSummary {...stateProps} />
            }
          }
        ]
      }
    ]
  })
