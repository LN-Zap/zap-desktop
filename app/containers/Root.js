import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { ThemeProvider } from 'styled-components'

import { removeNotification, notificationSelectors } from 'reducers/notification'
import { initSettings } from 'reducers/settings'
import { initTheme, themeSelectors } from 'reducers/theme'
import { walletSelectors } from 'reducers/wallet'
import { isLoading, isLoadingPerPath, getLoadingMessage } from 'reducers/utils'
import { setLoading, setMounted, appSelectors } from 'reducers/app'

import { Page, Titlebar, GlobalStyle } from 'components/UI'
import GlobalNotification from 'components/GlobalNotification'
import withLoading from 'components/withLoading'
import Initializer from './Initializer'
import Logout from './Logout'
import Home from './Home'
import ModalStack from './ModalStack'
import Onboarding from './Onboarding'
import Syncing from './Syncing'
import App from './App'
import WalletStarter from './WalletStarter'

// Wrap the page with our isLoading HOC so that the app displays the loading graphic when it first mounts.
const PageWithLoading = withLoading(Page)

/**
 * Root component that deals with mounting the app and managing top level routing.
 */
class Root extends React.Component {
  static propTypes = {
    hasWallets: PropTypes.bool,
    removeNotification: PropTypes.func.isRequired,
    theme: PropTypes.object,
    loadingMessage: PropTypes.object,
    notifications: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,

    initSettings: PropTypes.func.isRequired,
    initTheme: PropTypes.func.isRequired,
    isMounted: PropTypes.bool.isRequired,
    setMounted: PropTypes.func.isRequired
  }

  async componentDidMount() {
    const { initSettings, initTheme, isMounted, setMounted } = this.props

    // If this is the first time the app has mounted, initialize things.
    if (!isMounted) {
      setMounted(true)
      await initSettings()
      initTheme()
    }
  }

  redirectToHome = () => {
    const { history } = this.props
    history.push('/home')
  }

  redirectToLogout = () => {
    const { history } = this.props
    history.push('/logout')
  }

  render() {
    const {
      hasWallets,
      removeNotification,
      theme,
      notifications,
      history,
      isLoading,
      loadingMessage
    } = this.props

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
            <GlobalNotification
              notifications={notifications}
              removeNotification={removeNotification}
            />
            <ModalStack />
            <PageWithLoading isLoading={isLoading} loadingMessage={loadingMessage}>
              <Switch>
                <Route exact path="/" component={Initializer} />
                <Route exact path="/wallet-starter" component={WalletStarter} />
                <Route path="/home" component={Home} />
                <Route
                  exact
                  path="/onboarding"
                  render={() => (
                    <Onboarding hasWallets={hasWallets} onClose={this.redirectToHome} />
                  )}
                />
                <Route
                  exact
                  path="/syncing"
                  render={() => <Syncing onClose={this.redirectToLogout} pb={0} px={0} />}
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
  notifications: notificationSelectors.getNotificationState(state),
  theme: themeSelectors.currentThemeSettings(state),
  isLoading: isLoading(state) || isLoadingPerPath(state),
  loadingMessage: getLoadingMessage(state),
  isMounted: appSelectors.isMounted(state)
})

const mapDispatchToProps = {
  removeNotification,
  initSettings,
  initTheme,
  setLoading,
  setMounted
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
