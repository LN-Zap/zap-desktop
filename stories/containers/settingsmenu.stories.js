import React from 'react'

import { storiesOf } from '@storybook/react'

import SettingsMenu from 'containers/Settings/SettingsMenu'

import { Window } from '../helpers'
import { Provider } from '../Provider'

storiesOf('Containers.SettingsMenu', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .addDecorator(story => <Provider story={story()} />)
  .add('SettingsMenu', () => (
    <SettingsMenu activeWalletSettings={{ id: 1, type: 'local' }} isWalletReady />
  ))
