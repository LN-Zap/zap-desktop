import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { State, Store } from '@sambego/storybook-state'
import delay from 'lib/utils/delay'
import { Modal, Page } from 'components/UI'
import { Onboarding } from 'components/Onboarding'

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
  onboarded: false,
  onboarding: true
}

const store = new Store(initialValues)

// State
const setConnectionType = connectionType => store.set({ connectionType })
const setConnectionHost = connectionHost => store.set({ connectionHost })
const setConnectionCert = connectionCert => store.set({ connectionCert })
const setConnectionMacaroon = connectionMacaroon => store.set({ connectionMacaroon })
const setConnectionString = connectionString => store.set({ connectionString })
const setStartLndError = startLndError => store.set({ startLndError })
const setLndconnect = lndConnect => store.set({ lndConnect })
const setSeed = setSeed => store.set({ setSeed })

const setName = name => store.set({ name })
const setAutopilot = autopilot => store.set({ autopilot })
const setPassword = password => store.set({ password })
const resetOnboarding = () => {
  store.set(initialValues)
}

const fetchSeed = async () => {
  store.set({ fetchingSeed: true })
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
      'fix'
    ]
  })
  store.set({ fetchingSeed: false })
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
  .addParameters({
    info: {
      disable: true
    }
  })
  .addDecorator(story => (
    <Page css={{ height: 'calc(100vh - 40px)' }}>
      <Modal onClose={linkTo('Containers.Home', 'Home')}>{story()}</Modal>
    </Page>
  ))
  .add('Onboarding', () => {
    return (
      <State store={store}>
        <Onboarding
          // DISPATCH
          resetOnboarding={resetOnboarding}
          setName={setName}
          setAutopilot={setAutopilot}
          setConnectionType={setConnectionType}
          setConnectionHost={setConnectionHost}
          setConnectionCert={setConnectionCert}
          setConnectionMacaroon={setConnectionMacaroon}
          setConnectionString={setConnectionString}
          setStartLndError={setStartLndError}
          setLndconnect={setLndconnect}
          setSeed={setSeed}
          setPassword={setPassword}
          createNewWallet={createNewWallet}
          recoverOldWallet={recoverOldWallet}
          startLnd={startLnd}
          stopLnd={stopLnd}
          validateHost={validateHost}
          validateCert={validateCert}
          validateMacaroon={validateMacaroon}
          fetchSeed={fetchSeed}
        />
      </State>
    )
  })
