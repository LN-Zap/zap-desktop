import CryptoJS from 'crypto-js'
import { send } from 'redux-electron-ipc'

import { getIntl } from '@zap/i18n'
import { wordArrayToByteArray, byteToHexString } from '@zap/utils/byteutils'
import createReducer from '@zap/utils/createReducer'
import { infoSelectors } from 'reducers/info'
import { addInvoice } from 'reducers/invoice'
import { showWarning } from 'reducers/notification'
import { grpc } from 'workers'

import * as constants from './constants'
import messages from './messages'
import lnurlSelectors from './selectors'

const {
  SET_LNURL_AUTH_PARAMS,
  CLEAR_LNURL_AUTH,
  SET_LNURL_CHANNEL_PARAMS,
  CLEAR_LNURL_CHANNEL,
  SET_LNURL_WITHDRAW_PARAMS,
  CLEAR_LNURL_WITHDRAW,
} = constants

// ------------------------------------
// Initial State
// ------------------------------------

/**
 * @typedef State
 * @property {{service: string, secret: string}|null} lnurlAuthParams lnurl auth paramaters.
 * @property {{service: string, secret: string}|null} lnurlChannelParams lnurl channel paramaters.
 * @property {{service: string, amount: string, memo: string}|null} lnurlWithdrawParams lnurl withdraw paramaters.
 */

/** @type {State} */
const initialState = {
  lnurlAuthParams: null,
  lnurlChannelParams: null,
  lnurlWithdrawParams: null,
}

// ------------------------------------
// Actions - lnurl-auth
// ------------------------------------

/**
 * setLnurlAuthParams - Set request details.
 *
 * @param {object|null} params lnurl request details or null to clear.
 * @returns {object} Action
 */
export function setLnurlAuthParams(params) {
  return {
    type: SET_LNURL_AUTH_PARAMS,
    params,
  }
}

/**
 * clearLnurlAuth - Clears lnurl auth state.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const clearLnurlAuth = () => dispatch => {
  dispatch({ type: CLEAR_LNURL_AUTH })
}

/**
 * declineLnurlAuth - Cancels lnurl auth and clears params cache.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const declineLnurlAuth = () => dispatch => {
  dispatch(send('lnurlCancelAuth'))
  dispatch(clearLnurlAuth())
}

/**
 * finishLnurlAuth - Concludes lnurl auth request processing by sending our ln pubkey to the service.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const finishLnurlAuth = () => async (dispatch, getState) => {
  const state = getState()
  const lnurlAuthParams = lnurlSelectors.lnurlAuthParams(state)
  if (lnurlAuthParams && lnurlAuthParams) {
    const { service, secret } = lnurlAuthParams
    try {
      // Generate a linking key.
      //
      // NOTE: This is not complient with the lnurl-auth spec which recommends using
      // m/138'/<long1>/<long2>/<long3>/<long4>as the derivation path.
      // This is currently not possible with lnd due to limitations in the gRPC api.
      //
      // FIXME: make portable - https://github.com/btcontract/lnurl-rfc/blob/master/lnurl-auth.md
      const { rawKeyBytes: hashingPrivKey } = await grpc.services.WalletKit.deriveKey({
        keyFamily: 130,
        keyIndex: 0,
      })
      const derivationMaterial = CryptoJS.HmacSHA1(service, hashingPrivKey.toString('hex'))
      const byteArray = wordArrayToByteArray(derivationMaterial, 4)
      const longArray = Uint32Array.from(byteArray)
      const keyFamily = longArray[0]
      const keyIndex = longArray[1]
      const { rawKeyBytes: linkingKey } = await grpc.services.WalletKit.deriveKey({
        keyFamily,
        keyIndex,
      })

      // Sign the secret using our selected private key.
      const { signature } = await grpc.services.Signer.signMessage({
        msg: Buffer.from(secret, 'hex'),
        keyLoc: { keyFamily, keyIndex },
      })

      dispatch(
        send('lnurlFinishAuth', {
          sig: byteToHexString(signature),
          key: byteToHexString(linkingKey),
        })
      )
    } catch (e) {
      dispatch(send('lnurlCancelAuth'))
    }
    dispatch(clearLnurlAuth())
  }
}

// ------------------------------------
// Actions - lnurl-channel
// ------------------------------------

/**
 * setLnurlChannelParams - Set request details.
 *
 * @param {object|null} params lnurl request details or null to clear.
 * @returns {object} Action
 */
export function setLnurlChannelParams(params) {
  return {
    type: SET_LNURL_CHANNEL_PARAMS,
    params,
  }
}

/**
 * clearLnurlChannel - Clears lnurl channel state.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const clearLnurlChannel = () => dispatch => {
  dispatch({ type: CLEAR_LNURL_CHANNEL })
}

/**
 * declineLnurlChannel - Cancels lnurl channel and clears params cache.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const declineLnurlChannel = () => dispatch => {
  dispatch(send('lnurlCancelChannel'))
  dispatch(clearLnurlChannel())
}

/**
 * finishLnurlChannel - Concludes lnurl channel request processing by sending our ln pubkey to the service.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const finishLnurlChannel = () => async (dispatch, getState) => {
  const state = getState()
  const lnurlChannelParams = lnurlSelectors.lnurlChannelParams(state)
  if (lnurlChannelParams) {
    const { service } = lnurlChannelParams

    // Show notification.
    dispatch(
      showWarning(getIntl().formatMessage(messages.lnurl_channel_started), {
        timeout: 3000,
        isProcessing: true,
        payload: { service },
      })
    )

    const [pubkey, host] = service.split('@')
    await grpc.services.Lightning.ensurePeerConnected({ pubkey, host })
    dispatch(send('lnurlFinishChannel', { pubkey: infoSelectors.nodePubkey(state) }))
    dispatch(clearLnurlChannel())
  }
}

// ------------------------------------
// Actions - lnurl-withdraw
// ------------------------------------

/**
 * clearLnurlWithdraw - Clears lnurl withdraw state.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const clearLnurlWithdraw = () => dispatch => {
  dispatch({ type: CLEAR_LNURL_WITHDRAW })
}

/**
 * declineLnurlWithdraw - Cancels lnurl withdraw and clears params cache.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const declineLnurlWithdraw = () => dispatch => {
  dispatch(send('lnurlCancelWithdraw'))
  dispatch(clearLnurlWithdraw())
}

/**
 * setLnurlWithdrawParams - Set request details.
 *
 * @param {object|null} params lnurl request details or null to clear
 * @returns {object} Action
 */
export function setLnurlWithdrawParams(params) {
  return {
    type: SET_LNURL_WITHDRAW_PARAMS,
    params,
  }
}

/**
 * finishLnurlWithdraw - Concludes lnurl withdraw request processing by sending our ln PR to the service.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const finishLnurlWithdraw = () => async (dispatch, getState) => {
  const state = getState()
  const lnurlWithdrawParams = lnurlSelectors.lnurlWithdrawParams(state)
  if (lnurlWithdrawParams) {
    const { service, amount, memo } = lnurlWithdrawParams

    // Show notification.
    dispatch(
      showWarning(getIntl().formatMessage(messages.lnurl_withdraw_started), {
        timeout: 3000,
        isProcessing: true,
        payload: { service },
      })
    )

    // Create invoice.
    const { paymentRequest } = await dispatch(
      addInvoice({
        amount,
        memo,
        cryptoUnit: 'msats',
        isPrivate: true,
      })
    )

    // Hand off to main lnurl service to complete the process.
    dispatch(send('lnurlFinishWithdraw', { paymentRequest }))
    dispatch(clearLnurlWithdraw())
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_LNURL_AUTH_PARAMS]: (state, { params }) => {
    state.lnurlAuthParams = params
  },
  [CLEAR_LNURL_AUTH]: state => {
    state.lnurlAuthParams = null
  },
  [SET_LNURL_CHANNEL_PARAMS]: (state, { params }) => {
    state.lnurlChannelParams = params
  },
  [CLEAR_LNURL_CHANNEL]: state => {
    state.lnurlChannelParams = null
  },
  [SET_LNURL_WITHDRAW_PARAMS]: (state, { params }) => {
    state.lnurlWithdrawParams = params
  },
  [CLEAR_LNURL_WITHDRAW]: state => {
    state.lnurlWithdrawParams = null
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
