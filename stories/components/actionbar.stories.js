import React from 'react'

import { storiesOf } from '@storybook/react'

import { ActionBar } from 'components/UI'

storiesOf('Components', module).addWithChapters('ActionBar', {
  subtitle: 'For creating action bars',
  chapters: [
    {
      sections: [
        {
          title: 'Two buttons',
          sectionFn: () => (
            <ActionBar
              buttons={[
                { name: 'Cancel', onClick: () => alert('Cancel') },
                { name: 'Save', onClick: () => alert('Save') },
              ]}
            />
          ),
        },
      ],
    },
  ],
})
