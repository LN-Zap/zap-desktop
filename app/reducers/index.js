import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { intlReducer as intl } from 'react-intl-redux'
import locale from './locale'
import theme from './theme'
import app from './app'
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
    balance,
    channels,
    contactsform,
    info,
    invoice,
    lnd,
    modal,
    network,
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
    // Reset all reducers except for the app, theme, settings, and wallet reducers.
    if (action.type === 'RESET_APP') {
      const { app, settings, theme, wallet } = state
      return appReducer({ app, settings, theme, wallet }, action)
    }
    return appReducer(state, action)
  }
}
