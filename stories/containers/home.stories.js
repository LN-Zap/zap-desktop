import React from 'react'

import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { linkTo } from '@storybook/addon-links'
import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-react-router'

import delay from '@zap/utils/delay'
import Home from 'components/Home'

import { Window } from '../helpers'
import { Provider, store } from '../Provider'

const wallets = [
  {
    id: 1,
    autopilot: true,
    autopilotAllocation: 0.6,
    autopilotMaxchannels: 5,
    autopilotMaxchansize: 16777215,
    autopilotMinchansize: 20000,
    autopilotMinconfs: 1,
    autopilotPrivate: true,
    chain: 'bitcoin',
    network: 'testnet',
    type: 'local',
  },
  {
    id: 2,
    autopilot: false,
    chain: 'bitcoin',
    network: 'mainnet',
    type: 'local',
    name: 'Small Change',
  },
  {
    id: 3,
    type: 'custom',
    chain: 'bitcoin',
    network: 'testnet',
    host: 'mynode.local',
  },
  {
    id: 4,
    type: 'btcpayserver',
    chain: 'bitcoin',
    network: 'testnet',
    host: 'example.btcpaywithreallylongname.store',
  },
  {
    id: 5,
    type: 'btcpayserver',
    chain: 'bitcoin',
    network: 'testnet',
    host: 'example.btcpay.store',
    name: 'The Lightning Store',
  },
]

const showError = async error => {
  console.log('showError', error)
}
const startLnd = async wallet => {
  console.log('startLnd', wallet)
  await delay(500)
  store.set({ isWalletUnlockerGrpcActive: true, isLightningGrpcActive: false })
}
const stopLnd = async () => {
  console.log('stopLnd')
  await delay(500)
  store.set({ isWalletUnlockerGrpcActive: false, isLightningGrpcActive: false })
}
const unlockWallet = async (wallet, password) => {
  console.log('unlockWallet', wallet, password)
  await delay(300)
  store.set({ isWalletUnlockerGrpcActive: false, isLightningGrpcActive: true })
}
const deleteWallet = async walletId => {
  console.log('deleteWallet', walletId)
  await delay(200)
}
const setUnlockWalletError = async unlockWalletError => store.set({ unlockWalletError })
const setActiveWallet = async activeWallet => store.set({ activeWallet })

storiesOf('Containers.Home', module)
  .addDecorator(
    StoryRouter({
      '/onboarding': linkTo('Containers.Onboarding', 'Onboarding'),
      '/syncing': linkTo('Containers.Syncing', 'Syncing'),
      '/app': linkTo('Containers.App', 'App'),
    })
  )
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Home', () => {
    const hasWallets = boolean('Has wallets', true)
    return (
      <Home
        deleteWallet={deleteWallet}
        setActiveWallet={setActiveWallet}
        setIsWalletOpen={action('setIsWalletOpen')}
        setUnlockWalletError={setUnlockWalletError}
        showError={showError}
        startLnd={startLnd}
        stopLnd={stopLnd}
        unlockWallet={unlockWallet}
        wallets={hasWallets ? wallets : []}
      />
    )
  })
