import React from 'react'

import { storiesOf } from '@storybook/react'
import { Dialog } from 'components/UI'

storiesOf('Components', module).addWithChapters('Dialog', {
  subtitle: 'For showing prompts and messages',
  chapters: [
    {
      sections: [
        {
          title: 'Two buttons',
          sectionFn: () => (
            <Dialog
              caption={`Are you sure you want to delete "MyWallet" ?`}
              onClose={() => alert('closed')}
              buttons={[
                { name: 'Delete', onClick: () => alert('Delete') },
                { name: 'Cancel', onClick: () => alert('Cancel') }
              ]}
            />
          )
        },
        {
          title: 'Message box mode',
          sectionFn: () => (
            <Dialog
              caption="Your wallet has been removed"
              onClose={() => alert('closed')}
              buttons={[{ name: 'Ok', onClick: () => alert('Ok') }]}
            />
          )
        }
      ]
    }
  ]
})
