// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import PropTypes from 'prop-types'

import LoadingBolt from '../components/LoadingBolt'
import Onboarding from '../components/Onboarding'
import Syncing from '../components/Onboarding/Syncing'
import { updateAlias, changeStep, submit } from '../reducers/onboarding'
import { fetchBlockHeight, lndSelectors } from '../reducers/lnd'
import Routes from '../routes'

const mapDispatchToProps = {
  updateAlias,
  changeStep,
  submit,

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

  const aliasProps = {
    updateAlias: dispatchProps.updateAlias,
    alias: stateProps.onboarding.alias
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    aliasProps,
    syncingProps
  }
}

const Root = ({
  store,
  history,
  
  lnd,
  onboarding,
  submit,
  aliasProps,
  syncingProps,
  updateAlias,
  changeStep,
}) => {
  // If we are syncing show the syncing screen
  if (!onboarding.onboarded) {
    return (
      <Onboarding
        onboarding={onboarding}
        submit={submit}
        aliasProps={aliasProps}
      />
    )
  }

  // If we are syncing show the syncing screen
  if (lnd.syncing) {
    return <Syncing {...syncingProps} />
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
