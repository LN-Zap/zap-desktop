import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Flex } from 'rebass/styled-components'

import { getLanguageName } from '@zap/i18n'
import Logout from 'components/Icon/Logout'
import Settings from 'components/Icon/Settings'
import UserCircle from 'components/Icon/UserCircle'
import { Dropmenu, StatusIndicator } from 'components/UI'
import { WalletName } from 'components/Util'

import messages from './messages'

const buildLocaleMenu = localeProps => {
  const { locales, setLocale, currentLocale } = localeProps
  return Object.keys(locales).map(lang => {
    return {
      id: `locale-${lang}`,
      title: getLanguageName(lang),
      onClick: () => setLocale(lang),
      isSelected: currentLocale === lang,
      hasIndent: true,
    }
  })
}

const buildThemeMenu = themeProps => {
  const { themes, setTheme, currentTheme } = themeProps
  return Object.keys(themes).map(theme => {
    return {
      id: `currency-${theme}`,
      title: <FormattedMessage {...messages[`theme_option_${theme}`]} />,
      onClick: () => setTheme(theme),
      isSelected: currentTheme === theme,
      hasIndent: true,
    }
  })
}

const buildCurrencyMenu = fiatProps => {
  const { fiatTickers, setFiatTicker, fiatTicker } = fiatProps
  return fiatTickers.map(currency => {
    return {
      id: `currency-${currency}`,
      title: currency,
      onClick: () => setFiatTicker(currency),
      isSelected: fiatTicker === currency,
      hasIndent: true,
    }
  })
}

const SettingsMenu = ({
  localeProps,
  themeProps,
  fiatProps,
  activeWalletSettings,
  openModal,
  isWalletReady,
  history,
  ...rest
}) => {
  const logout = () => history.push('/logout')
  const openSettings = () => openModal('SETTINGS')
  const openProfile = () => openModal('PROFILE')

  const items = [
    {
      id: 'profile',
      title: <FormattedMessage {...messages.profile_title} />,
      icon: <UserCircle />,
      onClick: openProfile,
    },
    {
      id: 'settings',
      title: <FormattedMessage {...messages.settings_title} />,
      icon: <Settings />,
      onClick: openSettings,
    },
    {
      id: 'logout',
      title: (
        <FormattedMessage
          {...messages[activeWalletSettings.type === 'local' ? 'logout_title' : 'disconnect_title']}
        />
      ),
      icon: <Logout />,
      onClick: logout,
    },
    { id: 'bar1', type: 'bar' },
    {
      id: 'currency',
      title: <FormattedMessage {...messages.currency_title} />,
      submenu: buildCurrencyMenu(fiatProps),
    },
    {
      id: 'locale',
      title: <FormattedMessage {...messages.locale_title} />,
      submenu: buildLocaleMenu(localeProps),
    },
    {
      id: 'theme',
      title: <FormattedMessage {...messages.theme_title} />,
      submenu: buildThemeMenu(themeProps),
    },
  ]

  return (
    <Dropmenu items={items} justify="right" {...rest}>
      <Flex alignItems="center">
        <StatusIndicator mr={2} variant={isWalletReady ? 'online' : 'loading'} />
        <WalletName wallet={activeWalletSettings} />
      </Flex>
    </Dropmenu>
  )
}

SettingsMenu.displayName = 'SettingsMenu'

SettingsMenu.propTypes = {
  activeWalletSettings: PropTypes.object,
  closeSettingsMenu: PropTypes.func.isRequired,
  fiatProps: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  isSettingsMenuOpen: PropTypes.bool,
  isWalletReady: PropTypes.bool.isRequired,
  localeProps: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  openSettingsMenu: PropTypes.func.isRequired,
  themeProps: PropTypes.object.isRequired,
}

export default withRouter(SettingsMenu)
