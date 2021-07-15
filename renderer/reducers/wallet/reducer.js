import config from 'config'

import createReducer from '@zap/utils/createReducer'
import { closeDialog } from 'reducers/modal'
import { showError } from 'reducers/notification'
import { putSetting } from 'reducers/settings'

import * as constants from './constants'
import { activeWallet } from './selectors'

const {
  SET_WALLETS,
  SET_WALLETS_LOADED,
  DELETE_WALLET,
  DELETE_WALLET_SUCCESS,
  DELETE_WALLET_FAILURE,
  PUT_WALLET,
  DELETE_WALLET_DIALOG_ID,
} = constants

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isDeleteDialogOpen: false,
  isWalletsLoaded: false,
  deleteWalletError: null,
  wallets: [],
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setWallets - Populate wallets list.
 *
 * @param {Array} wallets List of wallet configs
 * @returns {object} Action
 */
export function setWallets(wallets) {
  return {
    type: SET_WALLETS,
    wallets,
  }
}

/**
 * setWalletsLoaded - Set wallets loaded state.
 *
 * @returns {object} Action
 */
export function setWalletsLoaded() {
  return {
    type: SET_WALLETS_LOADED,
  }
}

/**
 * getWallets - Fetch all wallet configs.
 *
 * @returns {(dispatch:Function) => Promise<Array<object>>} Thunk
 */
export const getWallets = () => async dispatch => {
  let wallets
  try {
    const allWallets = await window.db.wallets.toArray()
    wallets = await Promise.all(allWallets.map(window.Zap.generateLndConfigFromWallet))
  } catch (e) {
    wallets = []
  }
  dispatch(setWallets(wallets))
  return wallets
}

/**
 * setActiveWallet - Set the currently active wallet.
 *
 * @param {number} walletId Wallet Id
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const setActiveWallet = walletId => async dispatch => {
  dispatch(putSetting('activeWallet', walletId))
}

/**
 * setActiveWallet - Set the currently active wallet.
 *
 * @param {boolean} isWalletOpen Boolean indicating wither currently active wallet is open.
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const setIsWalletOpen = isWalletOpen => async dispatch => {
  dispatch(putSetting('isWalletOpen', isWalletOpen))
}

/**
 * putWallet - Create/Update a wallet config.
 *
 * @param {object} wallet Wallet config
 * @returns {Function} Thunk
 */
export const putWallet = wallet => async dispatch => {
  dispatch({ type: PUT_WALLET, wallet })
  const walletId = await window.db.wallets.put({ ...wallet })
  await dispatch(getWallets())
  return {
    ...wallet,
    id: walletId,
  }
}

/**
 * removeWallet - Remove a wallet config.
 *
 * @param {object} wallet Wallet config.
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const removeWallet = wallet => async dispatch => {
  // Delete the wallet from the filesystem.
  if (wallet.type === 'local') {
    const { chain, network, wallet: walletName } = wallet
    await window.Zap.deleteLocalWallet({ chain, network, wallet: walletName })
  }

  // Delete the wallet from the database.
  await window.db.wallets.delete(wallet.id)

  // Refresh the wallets state data.
  await dispatch(getWallets())
}

/**
 * deleteWallet - Handle delete wallet confirmation triggered by a user.
 * Removes currently active wallet.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const deleteWallet = () => async (dispatch, getState) => {
  try {
    const walletId = activeWallet(getState())
    if (walletId) {
      dispatch({ type: DELETE_WALLET, walletId })
      dispatch(closeDialog(DELETE_WALLET_DIALOG_ID))
      const state = getState().wallet
      const wallet = state.wallets.find(w => w.id === walletId)

      await dispatch(removeWallet(wallet))

      // Dispatch success message.
      dispatch({ type: DELETE_WALLET_SUCCESS, walletId })

      // Deselect and close the current wallet.
      await dispatch(setActiveWallet(null))
      await dispatch(setIsWalletOpen(false))
    }
  } catch (error) {
    dispatch(showError(error.message))
    dispatch({ type: DELETE_WALLET_FAILURE, error: error.message })
  }
}

/**
 * initWallets - Loads wallet configs from the database and filesystem.
 *
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const initWallets = () => async dispatch => {
  // Fetch wallet details.
  const dbWallets = await dispatch(getWallets())

  dispatch(setWalletsLoaded())

  // Create wallet entry in the database if one doesn't exist already.
  const { chains, networks } = config
  const fsWallets = await window.Zap.getAllLocalWallets(chains, networks)
  return fsWallets.forEach(walletDetails => {
    if (
      !dbWallets.find(
        w =>
          w.type === 'local' &&
          w.chain === walletDetails.chain &&
          w.network === walletDetails.network &&
          w.wallet === walletDetails.wallet
      )
    ) {
      walletDetails.decoder = 'lnd.lndconnect.v1'
      const id = Number(walletDetails.wallet.split('-')[1])
      if (id && !Number.isNaN(id)) {
        walletDetails.id = id
      }
      dispatch(putWallet(walletDetails))
    }
  })
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_WALLETS]: (state, { wallets }) => {
    state.wallets = wallets
  },
  [SET_WALLETS_LOADED]: state => {
    state.isWalletsLoaded = true
  },
  [DELETE_WALLET_FAILURE]: (state, { error }) => {
    state.deleteWalletError = error
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
