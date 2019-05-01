import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { Modal } from 'components/UI'
import Syncing from 'components/Syncing'
import { boolean, number, select } from '@storybook/addon-knobs'
import { neutrinoSelectors } from 'reducers/neutrino'
import { Provider, store } from '../Provider'
import { Window } from '../helpers'

const setIsWalletOpen = () => ({})
const showNotification = () => ({})

storiesOf('Containers.Syncing', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Window>{story()}</Window>)
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => (
    <Modal hasHeader onClose={linkTo('Containers.Home', 'Home')} pb={0} px={0}>
      {story()}
    </Modal>
  ))
  .add('Syncing', () => {
    const state = store.getState()
    const hasSynced = boolean('Has synced', false)
    const syncPercentage = number('Sync Percentage', 30)
    const syncStatus = select('Sync Status', ['waiting', 'in-progress', 'complete'], 'in-progress')
    const recoveryPercentage = number('Recovery Percentage', 30)
    const network = select('Network', ['mainnet', 'testnet'], 'mainnet')
    return (
      <Syncing
        address="2MxZ2z7AodL6gxEgwL5tkq2imDBhkBMq2Jc"
        blockHeight={neutrinoSelectors.blockHeight(state)}
        hasSynced={hasSynced}
        isLightningGrpcActive={state.lnd.isLightningGrpcActive}
        network={network}
        neutrinoBlockHeight={neutrinoSelectors.neutrinoBlockHeight(state)}
        neutrinoCfilterHeight={neutrinoSelectors.neutrinoCfilterHeight(state)}
        neutrinoRecoveryHeight={neutrinoSelectors.neutrinoRecoveryHeight(state)}
        recoveryPercentage={recoveryPercentage}
        setIsWalletOpen={setIsWalletOpen}
        showNotification={showNotification}
        syncPercentage={syncPercentage}
        syncStatus={syncStatus}
      />
    )
  })
