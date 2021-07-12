import React from 'react'

import { storiesOf } from '@storybook/react'

import SetPasswordDialog from 'components/Settings/Security/SetPasswordDialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Password Set', () => <SetPasswordDialog />)
