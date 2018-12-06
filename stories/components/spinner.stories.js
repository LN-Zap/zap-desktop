import React from 'react'

import { storiesOf } from '@storybook/react'
import { Spinner } from 'components/UI'
import FaRepeat from 'react-icons/lib/fa/repeat'

storiesOf('Components', module).addWithChapters('Spinner', {
  subtitle: 'For letting the user know that something is happening.',
  chapters: [
    {
      sections: [
        {
          sectionFn: () => <Spinner />
        },
        {
          sectionFn: () => <Spinner element={FaRepeat} />
        }
      ]
    }
  ]
})
