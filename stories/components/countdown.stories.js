import React from 'react'
import { storiesOf } from '@storybook/react'
import { Countdown } from 'components/UI'

storiesOf('Components', module).addWithChapters('Countdown', {
  chapters: [
    {
      sections: [
        {
          title: 'Default',
          sectionFn: () => <Countdown offset={new Date(new Date().getTime() + 10000)} />,
        },
        {
          title: 'Stop after expire',
          sectionFn: () => <Countdown isContinual={false} offset={5} />,
        },
        {
          title: 'Custom colors',
          sectionFn: () => (
            <Countdown colorActive="lightningOrange" colorExpired="yellow" offset={5} />
          ),
        },
      ],
    },
  ],
})
