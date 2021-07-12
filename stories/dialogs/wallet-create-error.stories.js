import React from 'react'

import { storiesOf } from '@storybook/react'

import OnboardingErrorDialog from 'components/Onboarding/Steps/components/ErrorDialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Wallet Create Error', () => (
    <OnboardingErrorDialog error="some error" isOpen onClose={() => {}} />
  ))
