import React from 'react'
import { storiesOf } from '@storybook/react'
import ProfilePage from 'containers/Profile/ProfilePage'
import { Provider } from '../Provider'
import { Window } from '../helpers'

storiesOf('Containers.ProfilePage', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('ProfilePage', () => <ProfilePage />)
