import React from 'react'

import { storiesOf } from '@storybook/react'

import { DeleteWalletDialog } from 'components/Home'

import { Window } from '../helpers'

storiesOf('Dialogs', module)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('Delete Wallet', () => (
    <DeleteWalletDialog
      isOpen
      onClose={() => {}}
      onDelete={() => {}}
      walletDir="/path/to/wallet/would/show/here"
    />
  ))
