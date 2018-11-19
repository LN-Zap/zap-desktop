import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { State, Store } from '@sambego/storybook-state'
import { Modal, Page } from 'components/UI'
import { Syncing } from 'components/Syncing'
import { boolean } from '@storybook/addon-knobs'

const store = new Store({
  address: '2MxZ2z7AodL6gxEgwL5tkq2imDBhkBMq2Jc',
  syncStatus: 'in-progress',
  blockHeight: 123123,
  lndBlockHeight: 1000,
  lndCfilterHeight: 100,
  isLoading: false,
  syncPercentage: 30
})

const setIsWalletOpen = () => ({})

storiesOf('Containers.Syncing', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .addDecorator(story => (
    <Page css={{ height: 'calc(100vh - 40px)' }}>
      <Modal withHeader onClose={linkTo('Containers.Home', 'Home')} pb={0} px={0}>
        {story()}
      </Modal>
    </Page>
  ))
  .add('Syncing', () => {
    const hasSynced = boolean('Has synced', false)
    return (
      <State store={store}>
        <Syncing setIsWalletOpen={setIsWalletOpen} hasSynced={hasSynced} />
      </State>
    )
  })
