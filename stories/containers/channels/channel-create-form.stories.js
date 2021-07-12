import React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { Modal } from 'components/UI'
import ChannelCreateForm from 'containers/Channels/ChannelCreateForm'

import { Window } from '../../helpers'
import { Provider } from '../../Provider'

storiesOf('Containers.Channels', module)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => (
    <Window>
      <Modal onClose={action('clicked')} p={4}>
        {story()}
      </Modal>
    </Window>
  ))
  .add('ChannelCreateForm', () => <ChannelCreateForm mx="auto" width={9 / 16} />)
