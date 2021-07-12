import React from 'react'

import { storiesOf } from '@storybook/react'

import { StatusIndicator } from 'components/UI'

storiesOf('Components', module).addWithChapters('StatusIndicator', {
  subtitle: 'For indicating node status',
  chapters: [
    {
      sections: [
        {
          title: 'Online',
          sectionFn: () => <StatusIndicator variant="online" />,
        },
        {
          title: 'Pending',
          sectionFn: () => <StatusIndicator variant="pending" />,
        },
        {
          title: 'Closing',
          sectionFn: () => <StatusIndicator variant="closing" />,
        },
        {
          title: 'Offline',
          sectionFn: () => <StatusIndicator variant="offline" />,
        },
      ],
    },
  ],
})
