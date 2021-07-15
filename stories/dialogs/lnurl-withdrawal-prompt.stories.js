import React from 'react'

import { storiesOf } from '@storybook/react'

import { LnurlWithdrawPrompt } from 'components/Lnurl'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Lnurl withdraw confirmation', () => (
    <LnurlWithdrawPrompt
      onOk={() => {}}
      onSkip={() => {}}
      params={{ amount: 10000, service: 'http://zaphq.io' }}
    />
  ))
