import React from 'react'

import { storiesOf } from '@storybook/react'

import PasswordPromptDialog from 'components/Settings/Security/PasswordPromptDialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Password Prompt', () => <PasswordPromptDialog />)
