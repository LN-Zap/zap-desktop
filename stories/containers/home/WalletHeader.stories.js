import React from 'react'

import { storiesOf } from '@storybook/react'

import { WalletHeader } from 'components/Home'
import { Text } from 'components/UI'

storiesOf('Containers.Home', module).addWithChapters('WalletHeader', {
  chapters: [
    {
      sections: [
        {
          title: 'Wallet with short name',
          sectionFn: () => (
            <WalletHeader
              wallet={{
                type: 'local',
                Name: 'Small Changee',
              }}
            />
          ),
          options: {
            decorator: story => <Text>{story()}</Text>,
          },
        },
        {
          title: 'Wallet with long name',
          sectionFn: () => (
            <WalletHeader
              wallet={{
                type: 'custom',
                host: 'example.btcpaywithareallyreallylongnamethatdoesntfitwell.store',
              }}
            />
          ),
          options: {
            decorator: story => <Text>{story()}</Text>,
          },
        },
      ],
    },
  ],
})
