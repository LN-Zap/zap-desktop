import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createZapIssueTemplate from '@zap/utils/github'
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
