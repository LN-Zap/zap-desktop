import get from 'lodash/get'
import { createSelector } from 'reselect'
import { send } from 'redux-electron-ipc'
import { grpc } from 'workers'
import { getIntl } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import { estimateFeeRange } from '@zap/utils/fee'
import { isAutopayEnabled } from '@zap/utils/featureFlag'
import { decodePayReq } from '@zap/utils/crypto'
import { showError } from './notification'
import { settingsSelectors } from './settings'
import { walletSelectors } from './wallet'
import { showAutopayNotification, autopaySelectors } from './autopay'
import { payInvoice } from './payment'
import createReducer from './utils/createReducer'
import { createInvoice } from './invoice'
import messages from './messages'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isQueryingRoutes: false,
  isQueryingFees: false,
  onchainFees: {
    fast: null,
    medium: null,
    slow: null,
  },
  pubKey: null,
  queryFeesError: null,
  queryRoutesError: null,
  redirectPayReq: null,
  lnurlWithdrawParams: null,
  routes: [],
}

// ------------------------------------
// Constants
// ------------------------------------
export const QUERY_FEES = 'QUERY_FEES'
export const QUERY_FEES_SUCCESS = 'QUERY_FEES_SUCCESS'
export const QUERY_FEES_FAILURE = 'QUERY_FEES_FAILURE'

export const QUERY_ROUTES = 'QUERY_ROUTES'
export const QUERY_ROUTES_SUCCESS = 'QUERY_ROUTES_SUCCESS'
export const QUERY_ROUTES_FAILURE = 'QUERY_ROUTES_FAILURE'

export const SET_REDIRECT_PAY_REQ = 'SET_REDIRECT_PAY_REQ'

export const SET_REDIRECT_LN_URL = 'SET_REDIRECT_LN_URL'

export const SET_LNURL = 'SET_LNURL'
export const DECLINE_LNURL_WITHDRAWAL = 'DECLINE_LNURL_WITHDRAWAL'

export const LNURL_WITHDRAWAL_PROMPT_DIALOG_ID = 'LNURL_WITHDRAWAL_PROMPT_DIALOG_ID'
// ------------------------------------
// IPC
// ------------------------------------

/**
 * lightningPaymentUri - Initiate lightning payment flow.
 *
 * @param  {event} event Event
 * @param  {{ address }} address Address (payment request)
 * @returns {Function} Thunk
 */
export const lightningPaymentUri = (event, { address }) => (dispatch, getState) => {
  const state = getState()

  const forwardToMainWindow = () => {
    dispatch(setRedirectPayReq({ address }))
  }

  // If the user is not logged into a wallet or autopay is not enabled just forward the payment request to the main
  // window and return early.
  if (!isAutopayEnabled || !walletSelectors.isWalletOpen(state)) {
    return forwardToMainWindow()
  }

  // Otherwise check if this payment request qualifies for autopay.
  try {
    const autopayList = autopaySelectors.autopayList(state)
    const invoice = decodePayReq(address)
    const { payeeNodeKey, satoshis, millisatoshis } = invoice
    const amountInSats = satoshis || convert('msats', 'sats', millisatoshis)
    const autopayEntry = autopayList[payeeNodeKey]

    // If autopay is enabled for the node pubkey we got from the invoice and the amount of the invoice is less
    // than the autopay's configured limit, pay the invoice silently in the background.
    if (autopayEntry && amountInSats <= autopayEntry.limit) {
      dispatch(showAutopayNotification(invoice))
      return dispatch(payInvoice({ payReq: address, amt: amountInSats }))
    }

    // If it wasn't handled with autopay or there was an error, open in the pay form and focus the app.
    return forwardToMainWindow()
  } catch (e) {
    return forwardToMainWindow()
  }
}

/**
 * bitcoinPaymentUri - Initiate bitcoin payment flow.
 *
 * @param  {event} event Event
 * @param  {{ address, options }} options Decoded bip21 payment url
 * @returns {Function} Thunk
 */
export const bitcoinPaymentUri = (event, { address, options = {} }) => dispatch => {
  // If the bip21 data includes a bolt11 invoice in the `lightning` key handle as a lightning payment.
  const { lightning } = options
  if (lightning) {
    dispatch(lightningPaymentUri(event, { address: lightning }))
  }
  // Otherwise, use the bitcoin address for on-chain payment.
  else {
    const { amount } = options
    dispatch(setRedirectPayReq({ address, amount }))
  }
}

/**
 * lnurlError - IPC handler for lnurlError event.
 *
 * @param  {event} event Event ipc event
 * @param  {object} params { service, reason }
 * @param  {string} params.service lnurl
 * @param  {string} params.reason error reason
 * @returns {Function} Thunk
 */
export const lnurlError = (event, { service, reason }) => dispatch => {
  const intl = getIntl()
  dispatch(showError(intl.formatMessage(messages.pay_lnurl_withdraw_error, { reason, service })))
}

/**
 * lnurlRequest - IPC handler for lnurlRequest event.
 *
 * @param  {event} event Event ipc event
 * @param  {object} params { service, amount, memo }
 * @param  {string} params.service lnurl
 * @param  {number} params.amount ln pr amount
 * @param  {string} params.memo ln pr memo
 * @returns {Function} Thunk
 */
export const lnurlRequest = (event, { service, amount, memo }) => dispatch => {
  dispatch(setLnurlWithdrawalParams({ amount, service, memo }))
}

/**
 * finishLnurlWithdrawal - Concludes lnurl withdraw request processing by sending our ln PR to the service.
 *
 * @returns {Function} Thunk
 */
export const finishLnurlWithdrawal = () => async (dispatch, getState) => {
  const state = getState()
  if (state.pay.lnurlWithdrawParams) {
    const { amount, memo } = getState().pay.lnurlWithdrawParams
    dispatch(setLnurlWithdrawalParams(null))
    const { payment_request: paymentRequest } = await dispatch(
      createInvoice({
        amount,
        memo,
        cryptoUnit: 'msats',
        isPrivate: true,
      })
    )
    dispatch(send('lnurlCreateInvoice', { paymentRequest }))
  }
}

/**
 * declineLnurlWithdrawal - Cancels lnurl withdrawal and clears params cache.
 *
 * @returns {object} Action
 */
export const declineLnurlWithdrawal = () => {
  return {
    type: DECLINE_LNURL_WITHDRAWAL,
  }
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * queryFees - Estimates on-chain fee.
 *
 * @param {string} address Destination address
 * @param {number} amountInSats desired amount in satoshis
 * @returns {Function} Thunk
 */
export const queryFees = (address, amountInSats) => async (dispatch, getState) => {
  dispatch({ type: QUERY_FEES })
  try {
    const onchainFees = await estimateFeeRange({
      address,
      amountInSats,
      range: settingsSelectors.currentConfig(getState()).lndTargetConfirmations,
    })

    dispatch({ type: QUERY_FEES_SUCCESS, onchainFees })
  } catch (e) {
    const error = get(e, 'response.statusText', e)
    dispatch({ type: QUERY_FEES_FAILURE, error })
  }
}

/**
 * queryRoutes - Find valid routes to make a payment to a node.
 *
 * @param {string} pubKey Destination node pubkey
 * @param {number} amount Desired amount in satoshis
 * @returns {Function} Thunk
 */
export const queryRoutes = (pubKey, amount) => async dispatch => {
  dispatch({ type: QUERY_ROUTES, pubKey })
  try {
    const { routes } = await grpc.services.Lightning.queryRoutes({
      pub_key: pubKey,
      amt: amount,
      use_mission_control: true,
    })
    dispatch({ type: QUERY_ROUTES_SUCCESS, routes })
  } catch (e) {
    dispatch({ type: QUERY_ROUTES_FAILURE })
  }
}

/**
 * setRedirectPayReq - Set payment request to initiate payment flow to a specific address / payment request.
 *
 * @param {{address, amount}} redirectPayReq Payment request details
 * @returns {object} Action
 */
export function setRedirectPayReq(redirectPayReq) {
  return {
    type: SET_REDIRECT_PAY_REQ,
    redirectPayReq,
  }
}
/**
 * setLnurlWithdrawalParams - Set request details.
 *
 * @param {object} params lnurl request details or null to clear
 * @returns {object} Action
 */
export function setLnurlWithdrawalParams(params) {
  return {
    type: SET_REDIRECT_LN_URL,
    params,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [QUERY_FEES]: state => {
    state.isQueryingFees = true
    state.onchainFees = {}
    state.queryFeesError = null
  },
  [QUERY_FEES_SUCCESS]: (state, { onchainFees }) => {
    state.isQueryingFees = false
    state.onchainFees = onchainFees
    state.queryFeesError = null
  },
  [QUERY_FEES_FAILURE]: (state, { error }) => {
    state.isQueryingFees = false
    state.onchainFees = {}
    state.queryFeesError = error
  },
  [QUERY_ROUTES]: (state, { pubKey }) => {
    state.isQueryingRoutes = true
    state.pubKey = pubKey
    state.queryRoutesError = null
    state.routes = []
  },
  [QUERY_ROUTES_SUCCESS]: (state, { routes }) => {
    state.isQueryingRoutes = false
    state.queryRoutesError = null
    state.routes = routes
  },
  [QUERY_ROUTES_FAILURE]: (state, { error }) => {
    state.isQueryingRoutes = false
    state.pubKey = null
    state.queryRoutesError = error
    state.routes = []
  },
  [SET_REDIRECT_PAY_REQ]: (state, { redirectPayReq }) => {
    state.redirectPayReq = redirectPayReq
  },

  [SET_REDIRECT_LN_URL]: (state, { params }) => {
    state.lnurlWithdrawParams = params
  },
  [DECLINE_LNURL_WITHDRAWAL]: state => {
    state.lnurlWithdrawParams = null
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const paySelectors = {}
const getLnurlWithdrawParamsSelector = state => state.pay.lnurlWithdrawParams

paySelectors.willShowLnurlWithdrawalPrompt = createSelector(
  getLnurlWithdrawParamsSelector,
  settingsSelectors.currentConfig,
  (params, config) => {
    const promptEnabled = config.lnurl.requirePrompt
    return Boolean(promptEnabled && params)
  }
)
paySelectors.lnurlWithdrawParams = createSelector(
  getLnurlWithdrawParamsSelector,
  params => params
)
export { paySelectors }

export default createReducer(initialState, ACTION_HANDLERS)
