/* eslint-disable no-shadow */
import React, { useCallback } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AppErrorBoundary from 'components/ErrorBoundary/AppErrorBoundary'
import ModalStack from 'components/ModalStack'
import SettingsPage from 'containers/Settings/SettingsPage'
import { closeModal, modalSelectors } from 'reducers/modal'

const MODALS = {
  SETTINGS: {
    component: SettingsPage,
  },
}

const RootAppModalStack = ({ closeModal, modals, ...rest }) => {
  const doClose = useCallback(() => closeModal(), [closeModal])
  return (
    // key is used to reset error boundary state when there is no error
    // https://github.com/bvaughn/react-error-boundary/issues/23
    <AppErrorBoundary key={modals} onCloseDialog={doClose}>
      <ModalStack {...rest} closeModal={closeModal} modalDefinitions={MODALS} modals={modals} />
    </AppErrorBoundary>
  )
}

RootAppModalStack.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modals: PropTypes.array.isRequired,
}
const mapStateToProps = state => ({
  modals: modalSelectors.getModalState(state),
})

const mapDispatchToProps = {
  closeModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(RootAppModalStack)
