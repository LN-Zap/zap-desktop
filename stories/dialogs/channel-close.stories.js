import React from 'react'

import { storiesOf } from '@storybook/react'

import { ChannelCloseDialog } from 'components/Channels'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Channel Close', () => (
    <ChannelCloseDialog csvDelay={144} isForceClose isOpen onCancel={() => {}} onClose={() => {}} />
  ))
