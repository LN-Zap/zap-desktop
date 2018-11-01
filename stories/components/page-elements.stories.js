import React from 'react'
import { storiesOf } from '@storybook/react'
import { Page, MainContent, Sidebar } from 'components/UI'

storiesOf('Components.Layouts', module)
  .add('MainContent', () => <MainContent>Main content</MainContent>)
  .add('Sidebar', () => <Sidebar>Sidebar</Sidebar>)
  .add('Page', () => <Page>Page</Page>)
  .add('Page - sidebar left', () => (
    <Page>
      <Sidebar.small>Sidebar left</Sidebar.small>
      <MainContent>Main content</MainContent>
    </Page>
  ))
  .add('Page - sidebar right', () => (
    <Page>
      <MainContent>Main content</MainContent>
      <Sidebar.large>Sidebar right</Sidebar.large>
    </Page>
  ))
