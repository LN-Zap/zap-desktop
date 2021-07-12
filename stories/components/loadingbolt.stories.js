import React from 'react'

import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import Loading from 'components/Loading'
import { Page } from 'components/UI'

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
