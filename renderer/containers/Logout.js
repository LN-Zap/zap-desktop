import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { stopLnd } from 'reducers/lnd'
import { resetApp } from 'reducers/app'
import { setIsWalletOpen } from 'reducers/wallet'

function Logout({ resetApp, setIsWalletOpen, stopLnd }) {
  useEffect(() => {
    stopLnd()
    setIsWalletOpen(false)
    resetApp()
  }, [resetApp, setIsWalletOpen, stopLnd])
  return <Redirect to="/" />
}

Logout.propTypes = {
  resetApp: PropTypes.func.isRequired,
  setIsWalletOpen: PropTypes.func.isRequired,
  stopLnd: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  resetApp,
  stopLnd,
  setIsWalletOpen,
}

export default connect(
  null,
  mapDispatchToProps
)(Logout)
