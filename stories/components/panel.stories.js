import React from 'react'
import { storiesOf } from '@storybook/react'
import { Panel } from 'components/UI'

storiesOf('Components.Panel', module).add('Panel', () => (
  <Panel css={{ height: '500px' }}>
    <Panel.Header bg="secondaryColor">Header here</Panel.Header>
    <Panel.Body bg="tertiaryColor">Body here</Panel.Body>
    <Panel.Footer bg="secondaryColor">Footer here</Panel.Footer>
  </Panel>
))
