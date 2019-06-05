/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { Modal } from 'components/UI'
import Request from 'containers/Request'
import { Provider } from '../Provider'
import { Window } from '../helpers'

storiesOf('Containers.Request', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Request', () => {
    return (
      <Modal p={3}>
        <Request mx="auto" width={9 / 16} />
      </Modal>
    )
  })
