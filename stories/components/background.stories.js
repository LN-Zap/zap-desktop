import React from 'react'
import { storiesOf } from '@storybook/react'
import BackgroundDark from 'components/UI/BackgroundDark'
import BackgroundLight from 'components/UI/BackgroundLight'
import BackgroundLightest from 'components/UI/BackgroundLightest'

storiesOf('Components.Background', module)
  .add('dark', () => (
    <BackgroundDark
      css={{
        height: '50vh'
      }}
    />
  ))
  .add('light', () => (
    <BackgroundLight
      css={{
        height: '50vh'
      }}
    />
  ))
  .add('lightest', () => (
    <BackgroundLightest
      css={{
        height: '50vh'
      }}
    />
  ))
