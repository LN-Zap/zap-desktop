import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { mainLog } from '@zap/utils/log'
import AppCrashedDialog from 'components/Dialog/AppCrashed'

export default class AppErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    onCloseDialog: PropTypes.func,
  }

  static defaultProps = {
    onCloseDialog: () => {},
  }

  static submitErrorIssue(error) {
    const url = window.Zap.createZapIssueTemplate('Unhandled React exception', error.stack, [
      'type: bug 🐛',
    ])
    window.Zap.openExternal(url)
  }

  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    mainLog.error(error)
    return { error }
  }

  render() {
    const { error } = this.state
    const { children, onCloseDialog } = this.props
    if (error) {
      return (
        <AppCrashedDialog
          error={error}
          isOpen
          onClose={onCloseDialog}
          onSubmit={AppErrorBoundary.submitErrorIssue}
        />
      )
    }

    return children
  }
}
