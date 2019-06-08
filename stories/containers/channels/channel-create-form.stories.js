import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ChannelCreateForm from 'containers/Channels/ChannelCreateForm'
import { Modal } from 'components/UI'
import { Provider } from '../../Provider'
import { Window } from '../../helpers'

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
