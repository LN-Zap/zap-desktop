import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { Menu } from 'components/UI'

const items = [
  { id: 'item1', title: 'Item 1', onClick: action },
  { id: 'item2', title: 'Item 2', onClick: action },
  { id: 'item3', title: 'Item 3', onClick: action },
]

storiesOf('Components', module).addWithChapters('Menu', {
  subtitle: 'For linking to things',
  info: `The Menu component is used to present lists of links.`,
  chapters: [
    {
      sections: [
        {
          sectionFn: () => <Menu items={items} />,
        },
      ],
    },
  ],
})
