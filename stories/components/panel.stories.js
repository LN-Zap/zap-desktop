import React from 'react'
import { storiesOf } from '@storybook/react'
import { Panel } from 'components/UI'

storiesOf('Components.Panel', module).add('Panel', () => (
  <Panel css={{ height: '500px' }}>
    <Panel.Header bg="lightBackground">Header here</Panel.Header>
    <Panel.Body bg="lightestBackground">Body here</Panel.Body>
    <Panel.Footer bg="lightBackground">Footer here</Panel.Footer>
  </Panel>
))
