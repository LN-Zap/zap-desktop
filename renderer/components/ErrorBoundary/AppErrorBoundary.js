import React, { Component } from 'react'

import PropTypes from 'prop-types'

import createZapIssueTemplate from '@zap/utils/github'
import { mainLog } from '@zap/utils/log'
import { DialogAppCrashed } from 'components/Dialog'

export default class AppErrorBoundary extends Component {
  static submitErrorIssue(error) {
    const { productName, version } = window.Zap.getPackageDetails()

    const url = createZapIssueTemplate({
      title: 'Unhandled React exception',
      body: error.stack,
      labels: ['type: bug 🐛', 'type: report'],
      productName,
      version,
    })
    window.Zap.openExternal(url)
  }

  state = {
    error: null,
  }

  static propTypes = {
    children: PropTypes.node,
    onCloseDialog: PropTypes.func,
  }

  static defaultProps = {
    onCloseDialog: () => {},
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
        <DialogAppCrashed
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
