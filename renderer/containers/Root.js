import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { Router } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { hot } from 'react-hot-loader/root'
import { removeNotification, notificationSelectors } from 'reducers/notification'
import { initDatabase, setLoading, setMounted, appSelectors } from 'reducers/app'
import { initSettings } from 'reducers/settings'
import { initTheme, themeSelectors } from 'reducers/theme'
import { initAccount } from 'reducers/account'
import { initLocale } from 'reducers/locale'
import { initCurrency } from 'reducers/ticker'
import { initWallets, walletSelectors } from 'reducers/wallet'
import { initNeutrino } from 'reducers/neutrino'
import { initAutopay } from 'reducers/autopay'
import { initChannels } from 'reducers/channels'
import { isLoading, isLoadingPerPath, getLoadingMessage } from 'reducers/utils'
import { Page, Titlebar, GlobalStyle } from 'components/UI'
import GlobalNotification from 'components/GlobalNotification'
import { withLoading } from 'hocs'
import { DialogLndCrashed } from './Dialog'
import Initializer from './Initializer'
import Logout from './Logout'
import Login from './Login'
import Home from './Home'
import ModalStack from './RootModalStack'
import Onboarding from './Onboarding/Onboarding'
import Syncing from './Syncing'
import App from './App'
import WalletStarter from './Wallet/WalletStarter'

// Wrap the page with our isLoading HOC so that the app displays the loading graphic when it first mounts.
const PageWithLoading = withLoading(Page)

// Root component that deals with mounting the app and managing top level routing.
const Root = ({
  initDatabase,
  initSettings,
  initTheme,
  initAccount,
  initNeutrino,
  initLocale,
  initCurrency,
  initAutopay,
  initWallets,
  initChannels,
  isMounted,
  setMounted,
  hasWallets,
  removeNotification,
  theme,
  notifications,
  history,
  isLoading,
  isAppReady,
  isRootReady,
  loadingMessage,
}) => {
  useEffect(() => {
    /**
     * init - Run async app initializers.
     */
    async function init() {
      if (!isMounted) {
        setMounted(true)
        await initDatabase()
        await initSettings()
        initTheme()
        initAccount()
        initNeutrino()
        initLocale()
        initCurrency()
        initAutopay()
        initWallets()
        initChannels()
      }
    }
    init()
  }, [
    initDatabase,
    initSettings,
    initTheme,
    initAccount,
    isMounted,
    setMounted,
    initNeutrino,
    initLocale,
    initCurrency,
    initAutopay,
    initWallets,
    initChannels,
  ])

  const redirectToHome = () => history.push('/home')
  const redirectToLogout = () => history.push('/logout')
  const canLogout = () => history.location.pathname === '/app'

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <GlobalStyle />
          <Titlebar />
          <GlobalNotification
            notifications={notifications}
            removeNotification={removeNotification}
          />
          <DialogLndCrashed />
          <PageWithLoading
            hasClose={canLogout()}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            onClose={redirectToLogout}
            pathname={history.location.pathname}
          >
            {isRootReady && (
              <Switch>
                <Route component={Login} exact path="/" />
                <Route component={Initializer} exact path="/init" />
                <Route component={WalletStarter} exact path="/wallet-starter" />
                <Route component={Home} path="/home" />
                <Route
                  exact
                  path="/onboarding"
                  render={() => <Onboarding hasWallets={hasWallets} onClose={redirectToHome} />}
                />
                <Route
                  exact
                  path="/syncing"
                  render={() => <Syncing onClose={redirectToLogout} pb={0} px={0} />}
                />
                <Route
                  path="/app"
                  render={() => {
                    if (!isAppReady) {
                      return null
                    }
                    return <App />
                  }}
                />
                <Route component={Logout} path="/logout" />
              </Switch>
            )}
          </PageWithLoading>
          <ModalStack />
        </React.Fragment>
      </ThemeProvider>
    </Router>
  )
}

Root.propTypes = {
  hasWallets: PropTypes.bool,
  history: PropTypes.object.isRequired,
  initAccount: PropTypes.func.isRequired,
  initAutopay: PropTypes.func.isRequired,
  initChannels: PropTypes.func.isRequired,
  initCurrency: PropTypes.func.isRequired,
  initDatabase: PropTypes.func.isRequired,
  initLocale: PropTypes.func.isRequired,
  initNeutrino: PropTypes.func.isRequired,
  initSettings: PropTypes.func.isRequired,
  initTheme: PropTypes.func.isRequired,
  initWallets: PropTypes.func.isRequired,
  isAppReady: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMounted: PropTypes.bool.isRequired,
  isRootReady: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.object,
  notifications: PropTypes.array.isRequired,
  removeNotification: PropTypes.func.isRequired,
  setMounted: PropTypes.func.isRequired,
  theme: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  hasWallets: walletSelectors.hasWallets(state),
  notifications: notificationSelectors.getNotificationState(state),
  theme: themeSelectors.currentThemeSettings(state),
  isLoading: isLoading(state) || isLoadingPerPath(state, ownProps.history.location),
  loadingMessage: getLoadingMessage(state),
  isMounted: appSelectors.isMounted(state),
  isAppReady: appSelectors.isAppReady(state),
  isRootReady: appSelectors.isRootReady(state),
})

const mapDispatchToProps = {
  removeNotification,
  initDatabase,
  initSettings,
  initTheme,
  initAccount,
  initNeutrino,
  initCurrency,
  initLocale,
  initWallets,
  initAutopay,
  initChannels,
  setLoading,
  setMounted,
}

export default hot(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Root)
)
