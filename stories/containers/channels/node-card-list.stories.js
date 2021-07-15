import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { NodeCardList } from 'components/Channels'

import { Provider } from '../../Provider'

const nodeClicked = action('onClick')

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('NodeCardList', {
    chapters: [
      {
        sections: [
          {
            options: { allowPropTablesToggling: false },
            sectionFn: () => {
              const nodes = [
                {
                  pubkey: '03634bda49c9c42afd876d8288802942c49e58fbec3844ff54b46143bfcb6cdfaf',
                  host: '157.230.144.234',
                  nickname: 'Zap technologies',
                  description: 'Making Bitcoin usable for everyone',
                  image:
                    'https://pbs.twimg.com/profile_images/1062081653013647360/X2pAwJEu_400x400.jpg',
                  nodeClicked,
                },
                {
                  pubkey: '03e50492eab4107a773141bb419e107bda3de3d55652e6e1a41225f06a0bbf2d56',
                  host: 'mainnet-lnd.yalls.org',
                  nickname: 'Yalls',
                  description: 'Read and write articles, with Lightning Network micropayments.',
                  image:
                    'https://pbs.twimg.com/profile_images/947351277293338624/fE1wDin7_400x400.jpg',
                  nodeClicked,
                },
                {
                  pubkey: '030c3f19d742ca294a55c00376b3b355c3c90d61c6b6b39554dbc7ac19b141c14f',
                  host: '52.50.244.44',
                  nickname: 'Bitrefill',
                  description: 'Live on Crypto',
                  image:
                    'https://pbs.twimg.com/profile_images/986911852943822849/f3eaWp7P_400x400.jpg',
                  nodeClicked,
                },
                {
                  pubkey: '03c2abfa93eacec04721c019644584424aab2ba4dff3ac9bdab4e9c97007491dda',
                  host: '88.4.177.28',
                  nickname: 'Tippin.me',
                  description: 'Receive tips and micro-payments everywhere.',
                  image:
                    'https://pbs.twimg.com/profile_images/1079148262601490432/nMPkPaoH_400x400.jpg',
                  nodeClicked,
                },
                {
                  pubkey: '03abf6f44c355dec0d5aa155bdbdd6e0c8fefe318eff402de65c6eb2e1be55dc3e',
                  host: '52.15.79.245',
                  nickname: 'Open Node',
                  description: 'Bitcoin, for everyday',
                  image:
                    'https://pbs.twimg.com/profile_images/1075120214549745664/-UrFQ6A7_400x400.jpg',
                  nodeClicked,
                },
                {
                  pubkey: '0331f80652fb840239df8dc99205792bba2e559a05469915804c08420230e23c7c',
                  host: '74.108.13.152',
                  nickname: 'Lightning Power Users',
                  description: 'Helping on-board the next wave of BTC/LN users',
                  image: 'https://lightningpowerusers.com/static/img/small_badger.png',
                  nodeClicked,
                },
              ]

              return <NodeCardList nodes={nodes} />
            },
          },
        ],
      },
    ],
  })
