/* eslint-disable max-len */

import React from 'react'

import { storiesOf } from '@storybook/react'

import { Modal } from 'components/UI'
import Pay from 'containers/Pay'

import { Window } from '../helpers'
import { Provider } from '../Provider'

storiesOf('Containers.Pay', module)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Pay', () => {
    return (
      <Modal p={3}>
        <Pay mx="auto" width={9 / 16} />
      </Modal>
    )
  })
