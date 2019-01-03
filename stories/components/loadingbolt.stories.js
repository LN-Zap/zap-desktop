import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { Page } from 'components/UI'
import LoadingBolt from 'components/LoadingBolt'

storiesOf('Components', module).addWithChapters('LoadingBolt', {
  subtitle: 'Animation to indicate application is loading.',
  chapters: [
    {
      sections: [
        {
          sectionFn: () => {
            const isLoading = boolean('Is loading', true)
            return (
              <Page>
                <LoadingBolt isLoading={isLoading} />
              </Page>
            )
          }
        }
      ]
    }
  ]
})
