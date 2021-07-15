import React from 'react'

import { storiesOf } from '@storybook/react'

import { Countdown } from 'components/UI'

storiesOf('Components', module).addWithChapters('Countdown', {
  chapters: [
    {
      sections: [
        {
          title: 'Default',
          sectionFn: () => <Countdown offset={new Date(Date.now() + 10000)} />,
        },
        {
          title: 'Stop after expire',
          sectionFn: () => <Countdown isContinual={false} offset={5} />,
        },
        {
          title: 'Far future expire',
          sectionFn: () => <Countdown isContinual={false} offset={31556952} />,
        },
        {
          title: 'Custom colors',
          sectionFn: () => (
            <Countdown colorActive="primaryAccent" colorExpired="yellow" offset={5} />
          ),
        },
      ],
    },
  ],
})
