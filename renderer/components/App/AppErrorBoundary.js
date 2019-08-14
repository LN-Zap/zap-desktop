import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { mainLog } from '@zap/utils/log'
import AppCrashedDialog from 'components/Dialog/AppCrashed'

export default class AppErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
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
    const { children } = this.props
    if (error) {
      return <AppCrashedDialog error={error} isOpen />
    }

    return children
  }
}
