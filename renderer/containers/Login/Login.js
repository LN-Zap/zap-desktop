import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { login, clearLoginError, accountSelectors } from 'reducers/account'
import Login from 'components/Login'

const WrappedLogin = ({ isAccountPasswordEnabled, isLoggedIn, ...rest }) => {
  if (isAccountPasswordEnabled && !isLoggedIn) {
    return <Login {...rest} />
  }
  return <Redirect to="/init" />
}

WrappedLogin.propTypes = {
  isAccountPasswordEnabled: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAccountPasswordEnabled: accountSelectors.isAccountPasswordEnabled(state),
  isLoggedIn: accountSelectors.isLoggedIn(state),
  loginError: accountSelectors.loginError(state),
})

const mapDispatchToProps = {
  login,
  clearLoginError,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedLogin)
