import React from 'react'

import { storiesOf } from '@storybook/react'

import { DialogAppCrashed } from 'components/Dialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('App Crashed', () => (
    <DialogAppCrashed
      error={{ message: 'some error', stack: 'stack trace would display here' }}
      isOpen
      onClose={() => {}}
      onSubmit={() => {}}
    />
  ))
