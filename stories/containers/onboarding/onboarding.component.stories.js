import React from 'react'

import { storiesOf } from '@storybook/react'

import {
  Autopilot,
  ConnectionType,
  ConnectionDetails,
  ConnectionConfirm,
  Login,
  Name,
  Network,
  Password,
  Recover,
  SeedConfirm,
  SeedView,
  WalletCreate,
} from 'components/Onboarding/Steps'

const setConnectionHost = () => ({})
const setConnectionCert = () => ({})
const setConnectionMacaroon = () => ({})
const stopLnd = () => ({})
const resetOnboarding = () => ({})
const wizardApi = { next() {} }

storiesOf('Containers.Onboarding.Forms', module)
  .add('ConnectionType', () => (
    <ConnectionType resetOnboarding={resetOnboarding} stopLnd={stopLnd} />
  ))
  .add('ConnectionDetails', () => (
    <ConnectionDetails
      setConnectionCert={setConnectionCert}
      setConnectionHost={setConnectionHost}
      setConnectionMacaroon={setConnectionMacaroon}
    />
  ))
  .add('ConnectionConfirm', () => <ConnectionConfirm connectionHost="example.com:10009" />)
  .add('Login', () => <Login />)
  .add('Password', () => <Password />)
  .add('Recover', () => <Recover seed={[]} />)
  .add('Name', () => <Name />)
  .add('Network', () => <Network />)
  .add('Autopilot', () => <Autopilot />)
  .add('Creating', () => <WalletCreate isCreatingWallet wizardApi={wizardApi} />)
  .add('SeedConfirm', () => (
    <SeedConfirm
      seed={[
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
      ]}
    />
  ))
  .add('SeedView', () => (
    <SeedView
      seed={[
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
      ]}
    />
  ))
