import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  Alias,
  Autopilot,
  ConnectionType,
  ConnectionDetails,
  ConnectionConfirm,
  Login,
  Name,
  Password,
  Recover,
  SeedConfirm,
  SeedView
} from 'components/Onboarding/Steps'

const setConnectionHost = () => ({})
const setConnectionCert = () => ({})
const setConnectionMacaroon = () => ({})
const stopLnd = () => ({})
const resetOnboarding = () => ({})

storiesOf('Containers.Onboarding.Forms', module)
  .add('ConnectionType', () => (
    <ConnectionType stopLnd={stopLnd} resetOnboarding={resetOnboarding} />
  ))
  .add('ConnectionDetails', () => (
    <ConnectionDetails
      setConnectionHost={setConnectionHost}
      setConnectionCert={setConnectionCert}
      setConnectionMacaroon={setConnectionMacaroon}
    />
  ))
  .add('ConnectionConfirm', () => <ConnectionConfirm connectionHost="example.com:10009" />)
  .add('Login', () => <Login />)
  .add('Password', () => <Password />)
  .add('Recover', () => <Recover seed={[]} />)
  .add('Alias', () => <Alias />)
  .add('Name', () => <Name />)
  .add('Autopilot', () => <Autopilot />)
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
        'fix'
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
        'fix'
      ]}
    />
  ))
