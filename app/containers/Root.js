import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { ThemeProvider } from 'styled-components'

import { clearError, errorSelectors } from 'reducers/error'
import { initTheme, themeSelectors } from 'reducers/theme'
import { walletSelectors } from 'reducers/wallet'
import { setLoading, setMounted, appSelectors } from 'reducers/app'

import { Page, Titlebar, GlobalStyle, Modal } from 'components/UI'
import GlobalError from 'components/GlobalError'
import withLoading from 'components/withLoading'
import Initializer from './Initializer'
import Logout from './Logout'
import Home from './Home'
import Onboarding from './Onboarding'
import Syncing from './Syncing'
import App from './App'

// Wrap the apge with our isLoading HOC so that the app displays the loading graphic whhen it first mounts.
const PageWithLoading = withLoading(Page)

// The minimum amount of time that we will show the loading component when the app mounts.
const SPLASH_SCREEN_TIME = 1500

/**
 * Root component that deals with mounting the app and managing top level routing.
 */
class Root extends React.Component {
  static propTypes = {
    hasWallets: PropTypes.bool,
    clearError: PropTypes.func.isRequired,
    theme: PropTypes.object,
    errors: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,

    initTheme: PropTypes.func.isRequired,
    isMounted: PropTypes.bool.isRequired,
    setMounted: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired
  }

  state = {
    timer: null
  }

  /**
   * // Show the loading bold briefly before showing the user the app.
   */
  componentDidMount() {
    const { initTheme, isLoading, isMounted, setLoading, setMounted, theme } = this.props

    // If this is the first time the app has mounted, initialise things.
    if (!isMounted) {
      setMounted(true)
      initTheme()
    }

    // Hide the loading screen after a set time.
    if (isLoading || !theme) {
      const timer = setTimeout(() => setLoading(false), SPLASH_SCREEN_TIME)
      this.setState({ timer })
    }
  }

  /**
   * Remove the timer when the component unmounts.
   */
  componentWillUnmount() {
    const { timer } = this.state
    clearTimeout(timer)
  }

  render() {
    const { hasWallets, clearError, theme, errors, history, isLoading } = this.props

    // Wait until we have loaded essential data before displaying anything.
    if (!theme) {
      return null
    }

    return (
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <GlobalStyle />
            <Titlebar />
            <GlobalError errors={errors} clearError={clearError} />
            <PageWithLoading isLoading={isLoading}>
              <Switch>
                <Route exact path="/" component={Initializer} />
                <Route path="/home" component={Home} />
                <Route
                  exact
                  path="/onboarding"
                  render={() => (
                    <Modal withClose={hasWallets} onClose={() => history.push('/home')}>
                      <Onboarding />
                    </Modal>
                  )}
                />
                <Route
                  exact
                  path="/syncing"
                  render={() => (
                    <Modal withHeader onClose={() => history.push('/logout')} pb={0} px={0}>
                      <Syncing />
                    </Modal>
                  )}
                />
                <Route path="/app" component={App} />
                <Route path="/logout" component={Logout} />
              </Switch>
            </PageWithLoading>
          </React.Fragment>
        </ThemeProvider>
      </ConnectedRouter>
    )
  }
}

const mapStateToProps = state => ({
  hasWallets: walletSelectors.hasWallets(state),
  errors: errorSelectors.getErrorState(state),
  theme: themeSelectors.currentThemeSettings(state),
  isLoading: appSelectors.isLoading(state) || state.lnd.startingLnd,
  isMounted: appSelectors.isMounted(state)
})

const mapDispatchToProps = {
  clearError,

  initTheme,
  setLoading,
  setMounted
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
