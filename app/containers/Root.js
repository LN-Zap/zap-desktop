// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { fetchBlockHeight, lndSelectors } from 'reducers/lnd'
import LndSyncing from 'components/LndSyncing'
import Routes from '../routes'

const mapDispatchToProps = {
  fetchBlockHeight
}

const mapStateToProps = state => ({
  syncPercentage: lndSelectors.syncPercentage(state)
})

type RootType = {
  store: {},
  history: {}
};

class Root extends React.Component {
  render() {
    const { store, history, fetchBlockHeight, syncPercentage } = this.props
    const { lnd } = store.getState()

    if (lnd.syncing) {
      return (
        <LndSyncing
          fetchBlockHeight={fetchBlockHeight}
          fetchingBlockHeight={lnd.fetchingBlockHeight}
          syncPercentage={syncPercentage}
        />
      )
    }

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    )
  }
} 


export default connect(mapStateToProps, mapDispatchToProps)(Root)