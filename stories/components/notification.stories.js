import React from 'react'

import { storiesOf } from '@storybook/react'

import { Notification } from 'components/UI'

storiesOf('Components', module).addWithChapters('Notification', {
  subtitle: 'For displaying important messages.',
  chapters: [
    {
      sections: [
        {
          title: 'Success',
          sectionFn: () => <Notification variant="success">Success notification</Notification>,
        },
        {
          title: 'Warning',
          sectionFn: () => <Notification variant="warning">Warning notification</Notification>,
        },
        {
          title: 'Error',
          sectionFn: () => <Notification variant="error">Error notification</Notification>,
        },
        {
          title: 'Processing',
          sectionFn: () => (
            <Notification isProcessing variant="warning">
              Processing notification
            </Notification>
          ),
        },
      ],
    },
  ],
})
