// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import PropTypes from 'prop-types'

import LoadingBolt from '../components/LoadingBolt'
import LndSyncing from '../components/LndSyncing'
import { fetchBlockHeight, lndSelectors } from '../reducers/lnd'
import Routes from '../routes'

const mapDispatchToProps = {
  fetchBlockHeight
}

const mapStateToProps = state => ({
  lnd: state.lnd,

  syncPercentage: lndSelectors.syncPercentage(state)
})

const Root = ({
  store,
  history,
  lnd,
  fetchBlockHeight, // eslint-disable-line no-shadow
  syncPercentage
}) => {
  // If we are syncing show the syncing screen
  if (lnd.syncing) {
    return (
      <LndSyncing
        fetchBlockHeight={fetchBlockHeight}
        fetchingBlockHeight={lnd.fetchingBlockHeight}
        syncPercentage={syncPercentage}
      />
    )
  }

  // Don't launch the app without gRPC connection
  if (!lnd.grpcStarted) { return <LoadingBolt /> }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  lnd: PropTypes.object.isRequired,
  fetchBlockHeight: PropTypes.func.isRequired,
  syncPercentage: PropTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
