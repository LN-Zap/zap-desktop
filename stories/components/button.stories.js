import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Button } from 'components/UI'
import SystemNavPrevious from 'components/Icon/SystemNavPrevious'
import SystemNavNext from 'components/Icon/SystemNavNext'

storiesOf('Components.Button', module)
  .add('Basic', () => <Button onClick={action('clicked')}>Basic button</Button>)
  .add('With Icon', () => (
    <section>
      <Button onClick={action('clicked')}>
        <SystemNavPrevious />
        Previous
      </Button>{' '}
      <Button onClick={action('clicked')}>
        Next
        <SystemNavNext />
      </Button>
    </section>
  ))
  .add('Processing', () => (
    <Button processing onClick={action('clicked')}>
      Processing
    </Button>
  ))
  .add('Disabled', () => (
    <Button disabled onClick={action('clicked')}>
      Disabled button
    </Button>
  ))
  .add('Primary', () => (
    <Button onClick={action('clicked')} variant="primary">
      Primary button
    </Button>
  ))
  .add('Secondary', () => (
    <Button onClick={action('clicked')} variant="secondary">
      Secondary button
    </Button>
  ))
  .add('Small', () => (
    <Button onClick={action('clicked')} size="small">
      Small button
    </Button>
  ))
  .add('Medium', () => (
    <Button onClick={action('clicked')} size="medium">
      Medium button
    </Button>
  ))
  .add('Large', () => (
    <Button onClick={action('clicked')} size="large">
      Large button
    </Button>
  ))
