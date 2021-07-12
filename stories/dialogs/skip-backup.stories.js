import React from 'react'

import { storiesOf } from '@storybook/react'

import SkipBackupsDialog from 'components/Onboarding/Steps/components/SkipBackupsDialog'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Skip Backups', () => (
    <SkipBackupsDialog isOpen isRestoreMode onCancel={() => {}} onSkip={() => {}} />
  ))
