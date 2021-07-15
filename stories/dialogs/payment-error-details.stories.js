import React from 'react'

import { storiesOf } from '@storybook/react'

import ErrorDetailsDialog from 'components/Activity/ErrorDetailsDialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Payment Error Details', () => (
    <ErrorDetailsDialog
      error={{ message: 'some error' }}
      isOpen
      onClose={() => {}}
      onCopy={() => {}}
    />
  ))
