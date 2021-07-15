import React from 'react'

import { storiesOf } from '@storybook/react'

import ChangePasswordDialog from 'components/Settings/Security/ChangePasswordDialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Password Change', () => <ChangePasswordDialog />)
