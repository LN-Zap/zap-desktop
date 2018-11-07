import React from 'react'
import { storiesOf } from '@storybook/react'
import { Countdown } from 'components/UI'

storiesOf('Components', module).addWithChapters('Countdown', {
  chapters: [
    {
      sections: [
        {
          title: 'Default',
          sectionFn: () => <Countdown date={Date.now() + 5000} />
        },
        {
          title: 'Stop after expire',
          sectionFn: () => <Countdown date={Date.now() + 5000} countUpAfterExpire={false} />
        },
        {
          title: 'Custom colors',
          sectionFn: () => (
            <Countdown
              date={Date.now() + 5000}
              colorActive="lightningOrange"
              colorExpired="yellow"
            />
          )
        }
      ]
    }
  ]
})
