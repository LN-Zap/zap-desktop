import React from 'react'
import { storiesOf } from '@storybook/react'
import { Header } from 'components/UI'
import Lightning from 'components/Icon/Lightning'

storiesOf('Components', module).addWithChapters('Header', {
  subtitle: 'A section heading with on optional title, subtitle, and icon.',
  chapters: [
    {
      sections: [
        {
          sectionFn: () => (
            <Header
              title="This is a heading"
              subtitle="You can add an optional subtitle too."
              logo={<Lightning />}
            />
          )
        }
      ]
    }
  ]
})
