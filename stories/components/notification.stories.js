import React from 'react'
import { storiesOf } from '@storybook/react'
import { Notification } from 'components/UI'

storiesOf('Components.Notification', module)
  .add('Success', () => <Notification variant="success">Success message</Notification>)
  .add('Warning', () => <Notification variant="warning">Warning message</Notification>)
  .add('Error', () => <Notification variant="error">Error message</Notification>)
  .add('Processing', () => <Notification processing>Processing message</Notification>)
