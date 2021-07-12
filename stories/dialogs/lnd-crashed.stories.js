import React from 'react'

import { storiesOf } from '@storybook/react'

import { DialogLndCrashed } from 'components/Dialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Lnd Crashed', () => (
    <DialogLndCrashed
      isOpen
      lndCrashReason={{
        code: '1',
        signal: 'SIGTERM',
        error: 'panic: some random lnd panic',
      }}
      onCancel={() => {}}
    />
  ))
