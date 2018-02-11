// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import onboarding from './onboarding'
import lnd from './lnd'
import ticker from './ticker'
import info from './info'
import balance from './balance'
import payment from './payment'
import peers from './peers'
import channels from './channels'
import channelform from './channelform'

import contactsform from './contactsform'

import form from './form'
import payform from './payform'
import requestform from './requestform'

import invoice from './invoice'
import modal from './modal'
import address from './address'
import transaction from './transaction'
import activity from './activity'
import network from './network'
import error from './error'

const rootReducer = combineReducers({
  router,
  onboarding,
  lnd,
  ticker,
  info,
  balance,
  payment,
  peers,
  channels,
  channelform,
  contactsform,

  form,
  payform,
  requestform,

  invoice,
  modal,
  address,
  transaction,
  activity,
  network,
  error
})

export default rootReducer
