import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { intlReducer as intl } from 'react-intl-redux'
import locale from './locale'
import theme from './theme'
import app from './app'
import autopay from './autopay'
import onboarding from './onboarding'
import lnd from './lnd'
import ticker from './ticker'
import info from './info'
import balance from './balance'
import payment from './payment'
import peers from './peers'
import channels from './channels'
import contactsform from './contactsform'
import pay from './pay'
import invoice from './invoice'
import address from './address'
import transaction from './transaction'
import activity from './activity'
import network from './network'
import neutrino from './neutrino'
import modal from './modal'
import notification from './notification'
import settings from './settings'
import settingsmenu from './settingsmenu'
import wallet from './wallet'

export default history => {
  const appReducer = combineReducers({
    // Third party reducers.
    intl,
    locale,
    router: connectRouter(history),
    theme,

    // Custom reducers
    activity,
    address,
    app,
    autopay,
    balance,
    channels,
    contactsform,
    info,
    invoice,
    lnd,
    modal,
    network,
    neutrino,
    notification,
    onboarding,
    pay,
    payment,
    peers,
    settings,
    settingsmenu,
    ticker,
    transaction,
    wallet,
  })

  return (state, action) => {
    // Reset all reducers, except for selected reducers which should persist.
    if (action.type === 'RESET_APP') {
      const { app, settings, intl, theme, wallet, lnd, neutrino, router, ticker } = state
      return appReducer(
        { app, settings, intl, theme, wallet, lnd, neutrino, router, ticker },
        action
      )
    }
    return appReducer(state, action)
  }
}
