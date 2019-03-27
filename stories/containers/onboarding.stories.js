import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { State, Store } from '@sambego/storybook-state'
import delay from '@zap/utils/delay'
import { Modal } from 'components/UI'
import { Onboarding } from 'components/Onboarding'
import { Window } from '../helpers'

const initialValues = {
  name: '',
  connectionType: 'local',
  connectionHost: '',
  connectionCert: '',
  connectionMacaroon: '',
  connectionString: `{
  "configurations": [
    {
      "type": "grpc",
      "cryptoCode": "BTC",
      "host": "host",
      "port": "19000",
      "macaroon": "macaroon"
    }
  ]
}`,
  startLndHostError: '',
  startLndCertError: '',
  startLndMacaroonError: '',
  password: '',
  seed: [],
  isOnboarded: false,
  onboarding: true,
}

const store = new Store(initialValues)

// State
const setConnectionType = connectionType => store.set({ connectionType })
const setConnectionHost = connectionHost => store.set({ connectionHost })
const setConnectionCert = connectionCert => store.set({ connectionCert })
const setConnectionMacaroon = connectionMacaroon => store.set({ connectionMacaroon })
const setName = name => store.set({ name })
const setAutopilot = autopilot => store.set({ autopilot })
const setPassword = password => store.set({ password })
const resetOnboarding = () => {
  store.set(initialValues)
}

const fetchSeed = async () => {
  store.set({ isFetchingSeed: true })
  await delay(1000)
  store.set({
    seed: [
      'idle',
      'fork',
      'derive',
      'idea',
      'pony',
      'exercise',
      'balance',
      'squirrel',
      'around',
      'sustain',
      'outdoor',
      'beach',
      'thrive',
      'fringe',
      'broom',
      'sea',
      'sick',
      'bacon',
      'card',
      'palace',
      'slender',
      'blue',
      'day',
      'fix',
    ],
  })
  store.set({ isFetchingSeed: false })
}

const startLnd = async () => {
  action('startLnd')
  await delay(500)
}
const stopLnd = async () => {
  action('stopLnd')
  await delay(500)
}

const validateHost = async value => {
  action('validateHost')
  await delay(300)
  return value === 'valid'
    ? Promise.resolve()
    : Promise.reject(new Error('invalid hostname (enter "valid")'))
}
const validateCert = async value => {
  action('validateCert')
  await delay(300)
  return value === 'valid'
    ? Promise.resolve()
    : Promise.reject(new Error('invalid cert (enter "valid")'))
}
const validateMacaroon = async value => {
  action('validateMacaroon')
  await delay(300)
  return value === 'valid'
    ? Promise.resolve()
    : Promise.reject(new Error('invalid macaroon (enter "valid")'))
}

const recoverOldWallet = async () => action('recoverOldWallet')
const createNewWallet = async () => action('recoverOldWallet')

storiesOf('Containers.Onboarding', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Window>{story()}</Window>)
  .addDecorator(story => <Modal onClose={linkTo('Containers.Home', 'Home')}>{story()}</Modal>)
  .add('Onboarding', () => {
    return (
      <State store={store}>
        <Onboarding
          // DISPATCH
          createNewWallet={createNewWallet}
          fetchSeed={fetchSeed}
          recoverOldWallet={recoverOldWallet}
          resetOnboarding={resetOnboarding}
          setAutopilot={setAutopilot}
          setConnectionCert={setConnectionCert}
          setConnectionHost={setConnectionHost}
          setConnectionMacaroon={setConnectionMacaroon}
          setConnectionType={setConnectionType}
          setName={setName}
          setPassword={setPassword}
          startLnd={startLnd}
          stopLnd={stopLnd}
          validateCert={validateCert}
          validateHost={validateHost}
          validateMacaroon={validateMacaroon}
        />
      </State>
    )
  })
