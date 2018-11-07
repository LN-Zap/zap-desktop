import React from 'react'
import { storiesOf } from '@storybook/react'
import { BackgroundPrimary, BackgroundTertiary, BackgroundSecondary } from 'components/UI'

storiesOf('Components.Background', module)
  .add('dark', () => (
    <BackgroundPrimary
      css={{
        height: '50vh'
      }}
    />
  ))
  .add('light', () => (
    <BackgroundTertiary
      css={{
        height: '50vh'
      }}
    />
  ))
  .add('lightest', () => (
    <BackgroundSecondary
      css={{
        height: '50vh'
      }}
    />
  ))
