import React from 'react'
import { storiesOf } from '@storybook/react'
import SettingsPage from 'containers/Settings/SettingsPage'
import { Provider } from '../Provider'
import { Window } from '../helpers'

storiesOf('Containers.SettingsPage', module)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('SettingsPage', () => <SettingsPage />)
