import React from 'react'

import { storiesOf } from '@storybook/react'

import { Tabs } from 'components/UI'

storiesOf('Components', module).addWithChapters('Tabs', {
  subtitle: 'List of buttons formatted as tabs',
  chapters: [
    {
      sections: [
        {
          sectionFn: () => (
            <Tabs
              items={[
                { key: 'all', name: 'All' },
                { key: 'sent', name: 'Send' },
                { key: 'received', name: 'Received' },
                { key: 'pending', name: 'Pending' },
              ]}
            />
          ),
        },
      ],
    },
  ],
})
