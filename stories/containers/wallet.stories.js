import React from 'react'
import { storiesOf } from '@storybook/react'
import Wallet from 'containers/Wallet'
import { Provider, store } from '../Provider'
import { Window } from '../helpers'

store.dispatch({
  type: 'SET_WALLETS',
  wallets: [
    {
      id: 1,
      type: 'local',
    },
  ],
})

store.dispatch({
  type: 'SET_SETTING',
  key: 'activeWallet',
  value: 1,
})

storiesOf('Containers.Wallet', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Window>{story()}</Window>)
  .addDecorator(story => <Provider story={story()} />)
  .add('Wallet', () => <Wallet />)
