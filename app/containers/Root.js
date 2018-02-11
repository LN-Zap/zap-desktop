// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import PropTypes from 'prop-types'

import LoadingBolt from '../components/LoadingBolt'
import Onboarding from '../components/Onboarding'
import Syncing from '../components/Onboarding/Syncing'
import { fetchBlockHeight, lndSelectors } from '../reducers/lnd'
import Routes from '../routes'

const mapDispatchToProps = {
  fetchBlockHeight
}

const mapStateToProps = state => ({
  onboarding: state.onboarding,
  lnd: state.lnd,

  syncPercentage: lndSelectors.syncPercentage(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const syncingProps = {
    fetchBlockHeight: dispatchProps.fetchBlockHeight,
    syncPercentage: stateProps.syncPercentage
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    syncingProps
  }
}

const Root = ({
  store,
  history,
  onboarding,
  syncingProps
}) => {
  // If we are syncing show the syncing screen
  if (!onboarding.onboarded) {
    return (
      <Onboarding
        onboarding={onboarding}
        syncingProps={syncingProps}
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
  onboarding: PropTypes.object.isRequired,
  syncingProps: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Root)
