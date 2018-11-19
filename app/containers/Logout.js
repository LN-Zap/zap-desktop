import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { restart } from 'reducers/lnd'
import { setIsWalletOpen } from 'reducers/wallet'

/**
 * Root component that deals with mounting the app and managing top level routing.
 */
class Logout extends React.Component {
  static propTypes = {
    lightningGrpcActive: PropTypes.bool,
    walletUnlockerGrpcActive: PropTypes.bool,
    restart: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { lightningGrpcActive, walletUnlockerGrpcActive, restart } = this.props
    if (lightningGrpcActive || walletUnlockerGrpcActive) {
      setIsWalletOpen(false)
      restart()
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive
})

const mapDispatchToProps = {
  restart,
  setIsWalletOpen
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Logout))
