/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Modal } from 'components/UI'
import ConnectManually from 'components/Contacts/ConnectManually'
import SubmitChannelForm from 'components/Contacts/SubmitChannelForm'
import { Provider } from '../Provider'
import { Window } from '../helpers'

storiesOf('Containers.Contacts', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => (
    <Window>
      <Modal>{story()}</Modal>
    </Window>
  ))
  .add('ConnectManually', () => {
    const dispatchProps = {
      closeManualForm: action('closeManualForm'),
      openSubmitChannelForm: action('openSubmitChannelForm'),
      setNode: action('setNode')
    }
    return <ConnectManually {...dispatchProps} width={9 / 16} mx="auto" />
  })
  .add('SubmitChannelForm', () => {
    const node = {
      alias: 'Jamie Dimon',
      pub_key: '0224d2b2c9b101bdcd941b7e6937d81fba6dfed271bf57121b6f001cd63594e2da',
      addresses: [{ addr: '0229a4b8ded6c7861208e1b438cba1f9e3c4aba7df56c990c46ea45d1850f5cadf' }]
    }
    const dispatchProps = {
      closeChannelForm: action('closeChannelForm'),
      closeContactsForm: action('closeContactsForm'),
      openChannel: action('openChanel')
    }
    return <SubmitChannelForm {...dispatchProps} node={node} width={9 / 16} mx="auto" />
  })
