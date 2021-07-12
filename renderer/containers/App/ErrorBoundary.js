import React, { useCallback } from 'react'

import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import AppErrorBoundary from 'components/ErrorBoundary/AppErrorBoundary'

const AppWithErrorBoundaries = ({ history, children }) => {
  const onCloseDialog = useCallback(() => {
    history.push('/logout')
  }, [history])

  return <AppErrorBoundary onCloseDialog={onCloseDialog}>{children}</AppErrorBoundary>
}

AppWithErrorBoundaries.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
}

export default withRouter(AppWithErrorBoundaries)
