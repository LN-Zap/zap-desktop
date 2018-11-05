import React from 'react'
import { storiesOf } from '@storybook/react'
import { Header } from 'components/UI'
import Lightning from 'components/Icon/Lightning'

storiesOf('Components.Header', module).add('Header', () => (
  <Header title="Title here" subtitle="Subtitle here" logo={<Lightning />} />
))
