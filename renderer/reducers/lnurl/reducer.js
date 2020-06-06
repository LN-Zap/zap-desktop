import { send } from 'redux-electron-ipc'
import CryptoJS from 'crypto-js'
import createReducer from '@zap/utils/createReducer'
import { wordArrayToByteArray, byteToHexString } from '@zap/utils/byteutils'
import { grpc } from 'workers'
import * as constants from './constants'
import lnurlSelectors from './selectors'

const { SET_LNURL_AUTH_PARAMS, CLEAR_LNURL_AUTH } = constants

// ------------------------------------
// Initial State
// ------------------------------------

/**
 * @typedef State
 * @property {{service: string, secret: string}|null} lnurlAuthParams Current lnurl auth paramaters.
 */

/** @type {State} */
const initialState = {
  lnurlAuthParams: null,
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setLnurlAuthParams - Set request details.
 *
 * @param {object|null} params lnurl request details or null to clear
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
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_LNURL_AUTH_PARAMS]: (state, { params }) => {
    state.lnurlAuthParams = params
  },
  [CLEAR_LNURL_AUTH]: state => {
    state.lnurlAuthParams = null
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
