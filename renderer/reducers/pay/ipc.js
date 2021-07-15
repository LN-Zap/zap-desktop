import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { decodePayReq } from '@zap/utils/crypto'
import { isAutopayEnabled } from '@zap/utils/featureFlag'
import { showAutopayNotification, autopaySelectors } from 'reducers/autopay'
import { payInvoice } from 'reducers/payment'
import { tickerSelectors } from 'reducers/ticker'
import { walletSelectors } from 'reducers/wallet'

import { setRedirectPayReq } from './reducer'

// ------------------------------------
// IPC
// ------------------------------------

/**
 * lightningPaymentUri - Initiate lightning payment flow.
 *
 * @param {event} event Event
 * @param {{ address: string }} address Address (payment request)
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
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
    if (autopayEntry && CoinBig(amountInSats).lte(autopayEntry.limit)) {
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
 * @param {event} event Event
 * @param {{ address: string, options }} options Decoded bip21 payment url
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
 */
export const bitcoinPaymentUri = (event, { address, options = {} }) => (dispatch, getState) => {
  // If the bip21 data includes a bolt11 invoice in the `lightning` key handle as a lightning payment.
  const { lightning } = options
  if (lightning) {
    dispatch(lightningPaymentUri(event, { address: lightning }))
  }
  // Otherwise, use the bitcoin address for on-chain payment.
  else {
    const { amount: amountInBtc } = options
    const cryptoUnit = tickerSelectors.cryptoUnit(getState())
    const amount = convert('btc', cryptoUnit, amountInBtc)
    dispatch(setRedirectPayReq({ address, amount }))
  }
}
