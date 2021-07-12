import React from 'react'

import { storiesOf } from '@storybook/react'

import { MainContent, Sidebar } from 'components/UI'

import { Window, Content } from '../helpers'

storiesOf('Layouts', module).addWithChapters('Page', {
  subtitle: 'The outer most application wrapper.',
  info: `Pages can have optional sidebars on the left or right.`,
  chapters: [
    {
      sections: [
        {
          title: 'Page with medium left sidebar',

          sectionFn: () => (
            <Window>
              <Sidebar.Medium bg="green">
                <Content>Sidebar</Content>
              </Sidebar.Medium>
              <MainContent bg="blue">
                <Content>MainContent</Content>
              </MainContent>
            </Window>
          ),
        },
        {
          title: 'Page with large right sidebar',
          sectionFn: () => (
            <Window>
              <MainContent bg="blue">
                <Content>MainContent</Content>
              </MainContent>
              <Sidebar.Large bg="green">
                <Content>Sidebar</Content>
              </Sidebar.Large>
            </Window>
          ),
        },
      ],
    },
  ],
})
