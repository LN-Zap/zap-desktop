import { connect } from 'react-redux'
import { setLocale } from 'reducers/locale'
import { setFiatTicker } from 'reducers/ticker'
import {
  openSettings,
  closeSettings,
  setActiveSubMenu,
  disableSubMenu
} from 'reducers/settingsmenu'
import { setTheme } from 'reducers/theme'
import { openModal } from 'reducers/modal'
import { walletSelectors } from 'reducers/wallet'

import Settings from 'components/Settings'

const mapStateToProps = state => ({
  activeSubMenu: state.settings.activeSubMenu,
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  fiatTicker: state.ticker.fiatTicker,
  fiatTickers: state.ticker.fiatTickers,
  locales: state.locale,
  currentLocale: state.intl.locale,
  themes: state.theme.themes,
  currentTheme: state.theme.currentTheme,
  isSettingsOpen: state.settingsmenu.isSettingsOpen
})

const mapDispatchToProps = {
  openSettings,
  closeSettings,
  setActiveSubMenu,
  openModal,
  disableSubMenu,
  setFiatTicker,
  setLocale,
  setTheme
}

const mergeProps = (stateProps, dispatchProps) => ({
  activeWalletSettings: stateProps.activeWalletSettings,
  activeSubMenu: stateProps.activeSubMenu,
  isSettingsOpen: stateProps.isSettingsOpen,
  openSettings: dispatchProps.openSettings,
  closeSettings: dispatchProps.closeSettings,
  setActiveSubMenu: dispatchProps.setActiveSubMenu,
  openModal: dispatchProps.openModal,

  fiatProps: {
    fiatTicker: stateProps.fiatTicker,
    fiatTickers: stateProps.fiatTickers,
    disableSubMenu: dispatchProps.disableSubMenu,
    setFiatTicker: dispatchProps.setFiatTicker
  },

  localeProps: {
    locales: stateProps.locales,
    currentLocale: stateProps.currentLocale,
    disableSubMenu: dispatchProps.disableSubMenu,
    setLocale: dispatchProps.setLocale
  },

  themeProps: {
    themes: stateProps.themes,
    currentTheme: stateProps.currentTheme,
    disableSubMenu: dispatchProps.disableSubMenu,
    setTheme: dispatchProps.setTheme
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Settings)
