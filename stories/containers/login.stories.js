import React from 'react'

import { storiesOf } from '@storybook/react'

import { LoginNotAllowed } from 'components/Login'
import Login from 'containers/Login'

import { Window } from '../helpers'
import { Provider } from '../Provider'

storiesOf('Containers.Login', module)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Login', () => {
    return <Login isAccountPasswordEnabled isLoggedIn={false} />
  })
  .add('Login not allowed', () => {
    return <LoginNotAllowed platform="darwin" />
  })
