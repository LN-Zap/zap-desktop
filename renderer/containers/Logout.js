import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { stopLnd } from 'reducers/lnd'
import { resetApp } from 'reducers/app'
import { setIsWalletOpen } from 'reducers/wallet'
import { startOnboarding } from 'reducers/onboarding'

function Logout({ resetApp, setIsWalletOpen, startOnboarding, stopLnd }) {
  useEffect(() => {
    stopLnd()
    setIsWalletOpen(false)
    resetApp()
    startOnboarding()
  }, [])
  return <Redirect to="/" />
}

Logout.propTypes = {
  resetApp: PropTypes.func.isRequired,
  setIsWalletOpen: PropTypes.func.isRequired,
  startOnboarding: PropTypes.func.isRequired,
  stopLnd: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  resetApp,
  stopLnd,
  setIsWalletOpen,
  startOnboarding,
}

export default connect(
  null,
  mapDispatchToProps
)(Logout)
