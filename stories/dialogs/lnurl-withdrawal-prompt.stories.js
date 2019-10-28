import React from 'react'
import { storiesOf } from '@storybook/react'
import { LnurlWithdrawalPrompt } from 'components/Pay'
import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Lnurl withdraw confirmation', () => (
    <LnurlWithdrawalPrompt
      onOk={() => {}}
      onSkip={() => {}}
      params={{ amount: 10000, service: 'http://zaphq.io' }}
    />
  ))
