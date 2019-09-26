import React from 'react'
import { storiesOf } from '@storybook/react'
import Login from 'containers/Login'
import { Provider } from '../Provider'
import { Window } from '../helpers'

storiesOf('Containers.Login', module)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Login', () => {
    return <Login isAccountPasswordEnabled isLoggedIn={false} />
  })
