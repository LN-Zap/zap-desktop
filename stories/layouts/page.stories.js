import React from 'react'
import { storiesOf } from '@storybook/react'
import { Page, MainContent, Sidebar } from 'components/UI'
import { Content } from '../helpers'

storiesOf('Layouts', module).addWithChapters('Page', {
  subtitle: 'The outer most application wrapper.',
  info: `Pages can have optional sidebars on the left or right.`,
  chapters: [
    {
      sections: [
        {
          title: 'Page with small left sidebar',

          sectionFn: () => (
            <Page>
              <Sidebar.small bg="green">
                <Content>Sidebar</Content>
              </Sidebar.small>
              <MainContent bg="blue">
                <Content>MainContent</Content>
              </MainContent>
            </Page>
          ),
        },
        {
          title: 'Page with large right sidebar',
          sectionFn: () => (
            <Page>
              <MainContent bg="blue">
                <Content>MainContent</Content>
              </MainContent>
              <Sidebar.large bg="green">
                <Content>Sidebar</Content>
              </Sidebar.large>
            </Page>
          ),
        },
      ],
    },
  ],
})
