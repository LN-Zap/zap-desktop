import { connect } from 'react-redux'
import { setLocale } from 'reducers/locale'
import { setFiatTicker } from 'reducers/ticker'
import {
  openSettingsMenu,
  closeSettingsMenu,
  setActiveSubMenu,
  disableSubMenu,
} from 'reducers/settingsmenu'
import { setTheme } from 'reducers/theme'
import { walletSelectors } from 'reducers/wallet'
import SettingsMenu from 'components/Settings/SettingsMenu'

const mapStateToProps = state => ({
  activeSubMenu: state.settingsmenu.activeSubMenu,
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  fiatTicker: state.ticker.fiatTicker,
  fiatTickers: state.ticker.fiatTickers,
  locales: state.locale,
  currentLocale: state.intl.locale,
  themes: state.theme.themes,
  currentTheme: state.theme.currentTheme,
  isSettingsMenuOpen: state.settingsmenu.isSettingsMenuOpen,
})

const mapDispatchToProps = {
  openSettingsMenu,
  closeSettingsMenu,
  setActiveSubMenu,
  disableSubMenu,
  setFiatTicker,
  setLocale,
  setTheme,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  activeWalletSettings: stateProps.activeWalletSettings,
  activeSubMenu: stateProps.activeSubMenu,
  isSettingsMenuOpen: stateProps.isSettingsMenuOpen,
  openSettingsMenu: dispatchProps.openSettingsMenu,
  closeSettingsMenu: dispatchProps.closeSettingsMenu,
  setActiveSubMenu: dispatchProps.setActiveSubMenu,
  ...ownProps,

  fiatProps: {
    fiatTicker: stateProps.fiatTicker,
    fiatTickers: stateProps.fiatTickers,
    disableSubMenu: dispatchProps.disableSubMenu,
    setFiatTicker: dispatchProps.setFiatTicker,
  },

  localeProps: {
    locales: stateProps.locales,
    currentLocale: stateProps.currentLocale,
    disableSubMenu: dispatchProps.disableSubMenu,
    setLocale: dispatchProps.setLocale,
  },

  themeProps: {
    themes: stateProps.themes,
    currentTheme: stateProps.currentTheme,
    disableSubMenu: dispatchProps.disableSubMenu,
    setTheme: dispatchProps.setTheme,
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SettingsMenu)
