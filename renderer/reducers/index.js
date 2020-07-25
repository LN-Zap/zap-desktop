import { combineReducers } from 'redux'
import { intlReducer as intl } from 'react-intl-redux'
import pick from 'lodash/pick'
import account from './account'
import locale from './locale'
import theme from './theme'
import app from './app'
import autopay from './autopay'
import autopilot from './autopilot'
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
import backup from './backup'
import lnurl from './lnurl'

/**
 * @typedef State
 * @property {object} intl Intl reducer.
 * @property {object} locale Locale reducer.
 * @property {import('./theme').State} theme Theme reducer.
 * @property {import('./account').State} account Account reducer.
 * @property {import('./activity').State} activity Activity reducer.
 * @property {import('./address').State} address Address reducer.
 * @property {import('./balance').State} balance Balance reducer.
 * @property {import('./info').State} info Info reducer.
 * @property {import('./invoice').State} invoice Invoice reducer.
 * @property {import('./lnurl').State} lnurl Lnurl reducer.
 * @property {import('./network').State} network Network reducer.
 * @property {import('./payment').State} payment Payment reducer.
 * @property {import('./settings').State} settings Settings reducer.
 * @property {import('./transaction').State} transaction Transaction reducer.
 */

/** @type {State} */
const reducers = {
  // Third party reducers.
  intl,

  // Custom reducers
  locale,
  theme,

  account,
  activity,
  address,
  app,
  autopay,
  autopilot,
  balance,
  backup,
  channels,
  contactsform,
  info,
  invoice,
  lnd,
  lnurl,
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
}

const appReducer = combineReducers(reducers)

export default (state, action) => {
  // Reset all reducers, except for selected reducers which should persist.
  if (action.type === 'RESET_APP') {
    const list = [
      'account',
      'app',
      'settings',
      'intl',
      'theme',
      'wallet',
      'lnd',
      'neutrino',
      'ticker',
    ]
    const persistentReducers = pick(state, list)

    if (list.length !== Object.keys(persistentReducers).length) {
      throw new Error(
        `RESET_APP: persistent reducers list size differs from the plucked state.
         One of the entries in the list is likely a typo`
      )
    }

    return appReducer(persistentReducers, action)
  }
  return appReducer(state, action)
}
