import React from 'react'

import { storiesOf } from '@storybook/react'

import { ProgressBar } from 'components/UI'

storiesOf('Components', module).addWithChapters('ProgressBar', {
  subtitle: 'For displaying progress towards a target.',
  info: `The ProgressBar component is used to display progress towards a target in percentage terms.`,
  chapters: [
    {
      sections: [
        {
          title: 'Default, 0%',
          sectionFn: () => <ProgressBar />,
        },
        {
          title: 'Default, 30%',
          sectionFn: () => <ProgressBar progress={0.3} />,
        },
        {
          title: 'Default, 70%, right justify',
          sectionFn: () => <ProgressBar justify="right" progress={0.7} />,
        },
        {
          title: 'Blue, 70%',
          sectionFn: () => <ProgressBar color="superBlue" progress={0.7} />,
        },
        {
          title: 'Blue, 30%, right justify',
          sectionFn: () => <ProgressBar color="superBlue" justify="right" progress={0.3} />,
        },
      ],
    },
  ],
})
