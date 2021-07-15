import React from 'react'

import { storiesOf } from '@storybook/react'

import { Message } from 'components/UI'

storiesOf('Components', module).addWithChapters('Message', {
  subtitle: 'For displaying messages.',
  chapters: [
    {
      sections: [
        {
          title: 'Success',
          sectionFn: () => <Message variant="success">Success message</Message>,
        },
        {
          title: 'Warning',
          sectionFn: () => <Message variant="warning">Warning message</Message>,
        },
        {
          title: 'Error',
          sectionFn: () => <Message variant="error">Error message</Message>,
        },
        {
          title: 'Processing',
          sectionFn: () => <Message variant="processing">Processing</Message>,
        },
      ],
    },
  ],
})
