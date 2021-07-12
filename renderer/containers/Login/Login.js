import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import Login from 'components/Login'
import { login, clearLoginError, accountSelectors, LOGIN_NOT_ALLOWED } from 'reducers/account'

const WrappedLogin = ({
  isAccountPasswordEnabled,
  isAccountLoading,
  isLoggedIn,
  loginError,
  ...rest
}) => {
  // special case where login is not allowed because  OS
  // secure storage infrastructure is not available
  if (loginError === LOGIN_NOT_ALLOWED) {
    return <Redirect to="/nologin" />
  }

  if (isAccountLoading || isAccountPasswordEnabled === null) {
    return null
  }

  if (isAccountPasswordEnabled && !isLoggedIn) {
    return <Login {...rest} loginError={loginError} />
  }
  return <Redirect to="/init" />
}

WrappedLogin.propTypes = {
  isAccountLoading: PropTypes.bool,
  isAccountPasswordEnabled: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  loginError: PropTypes.string,
}

const mapStateToProps = state => ({
  isAccountPasswordEnabled: accountSelectors.isAccountPasswordEnabled(state),
  isLoggedIn: accountSelectors.isLoggedIn(state),
  isAccountLoading: accountSelectors.isAccountLoading(state),
  loginError: accountSelectors.loginError(state),
})

const mapDispatchToProps = {
  login,
  clearLoginError,
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedLogin)
