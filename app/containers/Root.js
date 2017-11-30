// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { fetchBlockHeight, lndSelectors } from 'reducers/lnd'
import LoadingBolt from 'components/LoadingBolt'
import LndSyncing from 'components/LndSyncing'
import Routes from '../routes'

const mapDispatchToProps = {
  fetchBlockHeight
}

const mapStateToProps = state => ({
  lnd: state.lnd,

  syncPercentage: lndSelectors.syncPercentage(state)
})

class Root extends React.Component {
  render() {
    const {
      store,
      history,
      lnd,
      fetchBlockHeight,
      syncPercentage
    } = this.props

    console.log('lnd: ', lnd)
    console.log('lnd: ', lnd)

    if (lnd.syncing) {
      return (
        <LndSyncing
          fetchBlockHeight={fetchBlockHeight}
          fetchingBlockHeight={lnd.fetchingBlockHeight}
          syncPercentage={syncPercentage}
        />
      )
    }

    if (!lnd.grpcStarted) { return <LoadingBolt /> }

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

