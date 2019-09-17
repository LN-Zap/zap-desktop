import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { Page } from 'components/UI'
import Loading from 'components/LoadingBolt'

storiesOf('Components', module).addWithChapters('LoadingBolt', {
  subtitle: 'Animation to indicate application is loading.',
  chapters: [
    {
      sections: [
        {
          title: 'Bolt',
          sectionFn: () => {
            const isLoading = boolean('Is loading', true)
            return (
              <Page>
                <Loading hasClose isLoading={isLoading} onClose={() => {}} variant="bolt" />
              </Page>
            )
          },
        },
        {
          title: 'App',
          sectionFn: () => {
            const isLoading = boolean('Is loading', true)
            return (
              <Page>
                <Loading hasClose isLoading={isLoading} onClose={() => {}} variant="app" />
              </Page>
            )
          },
        },
        {
          title: 'Launchpad',
          sectionFn: () => {
            const isLoading = boolean('Is loading', true)
            return (
              <Page>
                <Loading isLoading={isLoading} variant="launchpad" />
              </Page>
            )
          },
        },
      ],
    },
  ],
})
