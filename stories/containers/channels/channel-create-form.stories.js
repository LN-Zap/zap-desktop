import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ChannelCreateForm from 'containers/Channels/ChannelCreateForm'
import { Modal } from 'components/UI'
import { Provider } from '../../Provider'
import { Window } from '../../helpers'

storiesOf('Containers.Channels', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => (
    <Window>
      <Modal onClose={action('clicked')}>{story()}</Modal>
    </Window>
  ))
  .add('ChannelCreateForm', () => <ChannelCreateForm width={9 / 16} mx="auto" />)
