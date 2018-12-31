import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { State, Store } from '@sambego/storybook-state'
import { Modal, Page } from 'components/UI'
import { Syncing } from 'components/Syncing'
import { boolean, number, select } from '@storybook/addon-knobs'

const store = new Store({
  address: '2MxZ2z7AodL6gxEgwL5tkq2imDBhkBMq2Jc',
  blockHeight: 123123,
  lndBlockHeight: 1000,
  lndCfilterHeight: 100,
  isLoading: false
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
    const syncPercentage = number('Sync Percentage', 30)
    const syncStatus = select('Sync Status', ['waiting', 'in-progress', 'complete'], 'in-progress')
    return (
      <State store={store}>
        {state => (
          <Syncing
            // State
            hasSynced={hasSynced}
            syncPercentage={syncPercentage}
            syncStatus={syncStatus}
            address={state.address}
            blockHeight={state.blockHeight}
            lndBlockHeight={state.lndBlockHeight}
            lndCfilterHeight={state.lndCfilterHeight}
            isLoading={state.isLoading}
            // Dispatch
            setIsWalletOpen={setIsWalletOpen}
          />
        )}
      </State>
    )
  })
