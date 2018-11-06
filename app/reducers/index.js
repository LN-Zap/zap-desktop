import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { intlReducer as intl } from 'react-intl-redux'
import locale from './locale'
import theme from './theme'
import onboarding from './onboarding'
import lnd from './lnd'
import ticker from './ticker'
import info from './info'
import balance from './balance'
import payment from './payment'
import peers from './peers'
import channels from './channels'
import contactsform from './contactsform'
import form from './form'
import pay from './pay'
import invoice from './invoice'
import address from './address'
import transaction from './transaction'
import activity from './activity'
import network from './network'
import error from './error'
import loading from './loading'
import settings from './settings'

export default history =>
  combineReducers({
    // Third party reducers.
    intl,
    locale,
    router: connectRouter(history),
    theme,

    // Custom reducers
    onboarding,
    lnd,
    ticker,
    info,
    balance,
    payment,
    peers,
    channels,
    contactsform,
    form,
    pay,
    invoice,
    address,
    transaction,
    activity,
    network,
    error,
    loading,
    settings
  })
