import React from 'react'

import { storiesOf } from '@storybook/react'

import ChangePasswordDialog from 'components/Settings/Security/ChangePasswordDialog'
import PasswordPromptDialog from 'components/Settings/Security/PasswordPromptDialog'
import SetPasswordDialog from 'components/Settings/Security/SetPasswordDialog'
import SettingsPage from 'containers/Settings/SettingsPage'

import { Window } from '../helpers'
import { Provider } from '../Provider'

storiesOf('Containers.SettingsPage', module)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('SettingsPage', () => <SettingsPage />)
  .add('Change password', () => <ChangePasswordDialog />)
  .add('Password prompt', () => <PasswordPromptDialog />)
  .add('Enable password', () => <SetPasswordDialog />)
