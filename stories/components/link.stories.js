import React from 'react'

import { storiesOf } from '@storybook/react'

import { Link } from 'components/UI'

storiesOf('Components', module).addWithChapters('Link', {
  subtitle: 'For linking to content.',
  info: `The Link component is used to link to external content.`,
  chapters: [
    {
      sections: [
        {
          sectionFn: () => <Link>A link to something cool</Link>,
        },
      ],
    },
  ],
})
