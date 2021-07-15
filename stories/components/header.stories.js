import React from 'react'

import { storiesOf } from '@storybook/react'

import Lightning from 'components/Icon/Lightning'
import { Header } from 'components/UI'

storiesOf('Components', module).addWithChapters('Header', {
  subtitle: 'A section heading with on optional title, subtitle, and icon.',
  chapters: [
    {
      sections: [
        {
          sectionFn: () => (
            <Header
              logo={<Lightning />}
              subtitle="You can add an optional subtitle too."
              title="This is a heading"
            />
          ),
        },
      ],
    },
  ],
})
