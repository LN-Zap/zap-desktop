/* eslint-disable no-shadow */
import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { logout } from 'reducers/app'
import { walletSelectors } from 'reducers/wallet'

const Logout = ({ logout, hasWallets }) => {
  useEffect(() => {
    logout()
  }, [logout])
  return <Redirect to={hasWallets ? '/home' : '/onboarding'} />
}

Logout.propTypes = {
  hasWallets: PropTypes.bool,
  logout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  hasWallets: walletSelectors.hasWallets(state),
})

const mapDispatchToProps = {
  logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
