import React from 'react'
import { storiesOf } from '@storybook/react'
import { BackgroundDark, BackgroundLight, BackgroundLightest } from 'components/UI'

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
