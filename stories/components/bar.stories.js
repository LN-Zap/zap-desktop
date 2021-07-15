import React from 'react'

import { storiesOf } from '@storybook/react'

import { Bar } from 'components/UI'

storiesOf('Components', module).addWithChapters('Bar', {
  subtitle: 'For dividing sections.',
  info: `The Bar component is used to divide sections.`,
  chapters: [
    {
      sections: [
        {
          sectionFn: () => <Bar variant="normal" />,
        },
        {
          sectionFn: () => <Bar variant="light" />,
        },
      ],
    },
  ],
})
