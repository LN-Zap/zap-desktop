import pick from 'lodash/pick'
import { intlReducer as intl } from 'react-intl-redux'
import { combineReducers } from 'redux'

import account from './account'
import activity from './activity'
import address from './address'
import app from './app'
import autopay from './autopay'
import autopilot from './autopilot'
import backup from './backup'
import balance from './balance'
import channels from './channels'
import contactsform from './contactsform'
import info from './info'
import invoice from './invoice'
import lnd from './lnd'
import lnurl from './lnurl'
import locale from './locale'
import modal from './modal'
import network from './network'
import neutrino from './neutrino'
import notification from './notification'
import onboarding from './onboarding'
import pay from './pay'
import payment from './payment'
import peers from './peers'
import settings from './settings'
import settingsmenu from './settingsmenu'
import theme from './theme'
import ticker from './ticker'
import transaction from './transaction'
import wallet from './wallet'

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
 * @property {import('./pay').State} pay Pay reducer.
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
