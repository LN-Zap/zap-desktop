import React from 'react'

import { storiesOf } from '@storybook/react'

import { Text } from 'components/UI'
import { WalletName } from 'components/Util'

storiesOf('Containers.Home', module).addWithChapters('WalletName', {
  chapters: [
    {
      sections: [
        {
          title: 'Local wallet, with name',
          sectionFn: () => (
            <WalletName
              wallet={{
                type: 'local',
                id: 1,
                host: 'local.host',
                name: 'Wallet name',
              }}
            />
          ),
          options: {
            decorator: story => <Text>{story()}</Text>,
          },
        },
        {
          title: 'Local wallet, without name',
          sectionFn: () => (
            <WalletName
              wallet={{
                type: 'local',
                id: 1,
                host: 'local.host',
              }}
            />
          ),
          options: {
            decorator: story => <Text>{story()}</Text>,
          },
        },
        {
          title: 'Custom wallet, with name',
          sectionFn: () => (
            <WalletName
              wallet={{
                type: 'custom',
                id: 1,
                host: 'local.host',
                name: 'Wallet name',
              }}
            />
          ),
          options: {
            decorator: story => <Text>{story()}</Text>,
          },
        },
        {
          title: 'Custom wallet, without name',
          sectionFn: () => (
            <WalletName
              wallet={{
                type: 'custom',
                id: 1,
                host: 'local.host',
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
