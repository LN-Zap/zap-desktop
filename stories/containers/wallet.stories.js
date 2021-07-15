import React from 'react'

import { storiesOf } from '@storybook/react'

import { MainContent } from 'components/UI'
import Wallet from 'containers/Wallet'

import { Window } from '../helpers'
import { Provider } from '../Provider'

storiesOf('Containers.Wallet', module)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Wallet', () => (
    <MainContent>
      <Wallet />
    </MainContent>
  ))
