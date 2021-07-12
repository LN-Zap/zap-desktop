import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { NodeCardView } from 'components/Channels'

import { Provider } from '../../Provider'

const nodeClicked = action('onClick')

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('NodeCardView', {
    chapters: [
      {
        sections: [
          {
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              const stateProps = {
                description: 'Making Bitcoin usable for everyone',
                host: '157.230.144.234',
                image:
                  'https://pbs.twimg.com/profile_images/1062081653013647360/X2pAwJEu_400x400.jpg',
                nickname: 'Zap technologies',
                pubkey: '03634bda49c9c42afd876d8288802942c49e58fbec3844ff54b46143bfcb6cdfaf',
              }
              const dispatchProps = {
                nodeClicked,
              }

              return <NodeCardView {...stateProps} {...dispatchProps} width={1 / 3} />
            },
          },
        ],
      },
    ],
  })
