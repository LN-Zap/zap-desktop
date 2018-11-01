import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { ThemeProvider } from 'styled-components'

import { clearError, errorSelectors } from 'reducers/error'
import { loadingSelectors, setLoading, setMounted } from 'reducers/loading'
import { initCurrency, initLocale } from 'reducers/locale'
import { initTheme, themeSelectors } from 'reducers/theme'
import { fetchTicker, tickerSelectors } from 'reducers/ticker'

import { Page, Titlebar, GlobalStyle } from 'components/UI'
import GlobalError from 'components/GlobalError'
import withLoading from 'components/withLoading'
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
    clearError: PropTypes.func.isRequired,
    currentTicker: PropTypes.object,
    theme: PropTypes.object,
    error: PropTypes.string,
    fetchTicker: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    initLocale: PropTypes.func.isRequired,
    initCurrency: PropTypes.func.isRequired,
    initTheme: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isMounted: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    setMounted: PropTypes.func.isRequired
  }

  /**
   * Initialise component state props.
   */
  constructor(props) {
    super(props)
    this.state = {
      timer: null
    }
  }

  /**
   * // Show the loading bold briefly before showing the user the app.
   */
  componentDidMount() {
    const {
      currentTicker,
      fetchTicker,
      initLocale,
      initCurrency,
      initTheme,
      isLoading,
      isMounted,
      setLoading,
      setMounted,
      theme
    } = this.props

    // If this is the first time the app has mounted, initialise things.
    if (!isMounted) {
      setMounted(true)
      initTheme()
      initLocale()
      initCurrency()
      fetchTicker()
    }

    // Hide the loading screen after a set time.
    if (isLoading || !currentTicker || !theme) {
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
    const { clearError, theme, error, history, isLoading } = this.props

    // Wait until we have loaded essential data before displaying anything..
    if (!theme) {
      return null
    }

    return (
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <GlobalStyle />
            <Titlebar />
            <GlobalError error={error} clearError={clearError} />
            <PageWithLoading isLoading={isLoading}>
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/onboarding" />} />
                <Route exact path="/onboarding" component={Onboarding} />
                <Route exact path="/syncing" component={Syncing} />
                <Route exact path="/app" component={App} />
              </Switch>
            </PageWithLoading>
          </React.Fragment>
        </ThemeProvider>
      </ConnectedRouter>
    )
  }
}

const mapStateToProps = state => ({
  currentTicker: tickerSelectors.currentTicker(state),
  theme: themeSelectors.currentThemeSettings(state),
  error: errorSelectors.getErrorState(state),
  isLoading: loadingSelectors.isLoading(state),
  isMounted: loadingSelectors.isMounted(state)
})

const mapDispatchToProps = {
  clearError,
  fetchTicker,
  initCurrency,
  initLocale,
  initTheme,
  setLoading,
  setMounted
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
