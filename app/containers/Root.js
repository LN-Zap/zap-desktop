// @flow
import React from 'react'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import PropTypes from 'prop-types'

import LoadingBolt from '../components/LoadingBolt'
import Onboarding from '../components/Onboarding'
import Syncing from '../components/Onboarding/Syncing'
import { updateAlias, setAutopilot, changeStep, submit } from '../reducers/onboarding'
import { fetchBlockHeight, lndSelectors } from '../reducers/lnd'
import Routes from '../routes'

const mapDispatchToProps = {
  updateAlias,
  setAutopilot,
  changeStep,
  submit,

  fetchBlockHeight
}

const mapStateToProps = state => ({
  lnd: state.lnd,
  onboarding: state.onboarding,

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

  const autopilotProps = {
    autopilot: stateProps.onboarding.autopilot,
    setAutopilot: dispatchProps.setAutopilot
  }

  const onboardingProps = {
    onboarding: stateProps.onboarding,
    changeStep: dispatchProps.changeStep,
    submit: dispatchProps.submit,
    aliasProps,
    autopilotProps
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    onboardingProps,
    syncingProps
  }
}

const Root = ({
  store,
  history,

  lnd,
  onboardingProps,
  syncingProps
}) => {
  // If we are syncing show the syncing screen
  if (!onboardingProps.onboarding.onboarded) {
    return <Onboarding {...onboardingProps} />
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
  lnd: PropTypes.object.isRequired,
  onboardingProps: PropTypes.object.isRequired,
  syncingProps: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Root)
