import { connect } from 'react-redux'

import SettingsMenu from 'components/Settings/SettingsMenu'
import { infoSelectors } from 'reducers/info'
import { setLocale } from 'reducers/locale'
import { openModal } from 'reducers/modal'
import { openSettingsMenu, closeSettingsMenu } from 'reducers/settingsmenu'
import { setTheme, themeSelectors } from 'reducers/theme'
import { setFiatTicker, tickerSelectors } from 'reducers/ticker'
import { walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => ({
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  fiatTicker: tickerSelectors.fiatTicker(state),
  fiatTickers: tickerSelectors.fiatTickers(state),
  locales: state.locale,
  currentLocale: state.intl.locale,
  themes: state.theme.themes,
  currentTheme: themeSelectors.currentTheme(state),
  isSettingsMenuOpen: state.settingsmenu.isSettingsMenuOpen,
  isWalletReady: infoSelectors.isSyncedToChain(state),
})

const mapDispatchToProps = {
  openSettingsMenu,
  openModal,
  closeSettingsMenu,
  setFiatTicker,
  setLocale,
  setTheme,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  activeWalletSettings: stateProps.activeWalletSettings,
  isWalletReady: stateProps.isWalletReady,
  isSettingsMenuOpen: stateProps.isSettingsMenuOpen,
  openModal: dispatchProps.openModal,
  openSettingsMenu: dispatchProps.openSettingsMenu,
  closeSettingsMenu: dispatchProps.closeSettingsMenu,
  ...ownProps,

  fiatProps: {
    fiatTicker: stateProps.fiatTicker,
    fiatTickers: stateProps.fiatTickers,
    setFiatTicker: dispatchProps.setFiatTicker,
  },

  localeProps: {
    locales: stateProps.locales,
    currentLocale: stateProps.currentLocale,
    setLocale: dispatchProps.setLocale,
  },

  themeProps: {
    themes: stateProps.themes,
    currentTheme: stateProps.currentTheme,
    setTheme: dispatchProps.setTheme,
  },
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SettingsMenu)
