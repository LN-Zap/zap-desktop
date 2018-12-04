import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { boolean } from '@storybook/addon-knobs'
import { State, Store } from '@sambego/storybook-state'
import StoryRouter from 'storybook-react-router'
import { Page } from 'components/UI'
import { Home } from 'components/Home'

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

const store = new Store({
  activeWallet: 1,
  lightningGrpcActive: false,
  walletUnlockerGrpcActive: false,
  unlockingWallet: false,
  unlockWalletError: '',
  wallets: [
    {
      id: 1,
      autopilot: true,
      autopilotAllocation: 0.6,
      autopilotMaxchannels: 5,
      autopilotMaxchansize: 16777215,
      autopilotMinchansize: 20000,
      autopilotMinconfs: 0,
      autopilotPrivate: true,
      chain: 'bitcoin',
      network: 'testnet',
      type: 'local'
    },
    {
      id: 2,
      autopilot: false,
      chain: 'bitcoin',
      network: 'mainnet',
      type: 'local',
      name: 'Small Change'
    },
    {
      id: 3,
      type: 'custom',
      chain: 'bitcoin',
      network: 'testnet',
      host: 'mynode.local'
    },
    {
      id: 4,
      type: 'btcpayserver',
      chain: 'bitcoin',
      network: 'testnet',
      host: 'example.btcpaywithreallylongname.store'
    },
    {
      id: 5,
      type: 'btcpayserver',
      chain: 'bitcoin',
      network: 'testnet',
      host: 'example.btcpay.store',
      name: 'The Lightning Store'
    }
  ]
})

const startLnd = async wallet => {
  console.log('startLnd', wallet)
  await delay(500)
  store.set({ walletUnlockerGrpcActive: true, lightningGrpcActive: false })
}
const stopLnd = async () => {
  console.log('stopLnd')
  await delay(500)
  store.set({ walletUnlockerGrpcActive: false, lightningGrpcActive: false })
}
const unlockWallet = async (wallet, password) => {
  console.log('unlockWallet', wallet, password)
  await delay(300)
  store.set({ walletUnlockerGrpcActive: false, lightningGrpcActive: true })
}
const deleteWallet = async walletId => {
  console.log('deleteWallet', walletId)
  await delay(200)
}
const setUnlockWalletError = async unlockWalletError => store.set({ unlockWalletError })
const setActiveWallet = async activeWallet => store.set({ activeWallet })

storiesOf('Containers.Home', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .addDecorator(
    StoryRouter({
      '/onboarding': linkTo('Containers.Onboarding', 'Onboarding'),
      '/syncing': linkTo('Containers.Syncing', 'Syncing'),
      '/app': linkTo('Containers.App', 'App')
    })
  )
  .add('Home', () => {
    const hasWallets = boolean('Has wallets', true)
    return (
      <Page css={{ height: 'calc(100vh - 40px)' }}>
        <State store={store}>
          {state => (
            <Home
              activeWallet={state.activeWallet}
              lightningGrpcActive={state.lightningGrpcActive}
              walletUnlockerGrpcActive={state.walletUnlockerGrpcActive}
              unlockingWallet={state.unlockingWallet}
              unlockWalletError={state.unlockWalletError}
              wallets={hasWallets ? state.wallets : []}
              startLnd={startLnd}
              stopLnd={stopLnd}
              unlockWallet={unlockWallet}
              deleteWallet={deleteWallet}
              setUnlockWalletError={setUnlockWalletError}
              setActiveWallet={setActiveWallet}
            />
          )}
        </State>
      </Page>
    )
  })
