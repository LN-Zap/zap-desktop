import config from 'config'
import { createSelector } from 'reselect'
import { showError } from './notification'
import { putSetting } from './settings'
import createReducer from './utils/createReducer'

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
// Constants
// ------------------------------------

export const SET_WALLETS = 'SET_WALLETS'
export const SET_WALLETS_LOADED = 'SET_WALLETS_LOADED'
export const DELETE_WALLET = 'DELETE_WALLET'
export const OPEN_DELETE_WALLET_DIALOG = 'OPEN_DELETE_WALLET_DIALOG'
export const CLOSE_DELETE_WALLET_DIALOG = 'CLOSE_DELETE_WALLET_DIALOG'
export const DELETE_WALLET_SUCCESS = 'DELETE_WALLET_SUCCESS'
export const DELETE_WALLET_FAILURE = 'DELETE_WALLET_FAILURE'
export const PUT_WALLET = 'PUT_WALLET'

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
 * setWalletsLoaded - Set wallts loaded state.
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
 * @returns {Function} Thunk
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
 * @param {number} activeWallet Wallet Id
 * @returns {Function} Thunk
 */
export const setActiveWallet = activeWallet => async dispatch => {
  dispatch(putSetting('activeWallet', activeWallet))
}

/**
 * setActiveWallet - Set the currently active wallet.
 *
 * @param {boolean} isWalletOpen Boolean indicating wither currently active wallet is open.
 * @returns {Function} Thunk
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
 * showDeleteWalletDialog - Show the delete wallet dialog.
 *
 * @returns {object} Action
 */
export const showDeleteWalletDialog = () => ({
  type: OPEN_DELETE_WALLET_DIALOG,
})

/**
 * hideDeleteWalletDialog - Hide the delete wallet dialog.
 *
 * @returns {object} Action
 */
export const hideDeleteWalletDialog = () => ({
  type: CLOSE_DELETE_WALLET_DIALOG,
})

/**
 * removeWallet - Remove a wallet config.
 *
 * @param  {object} wallet Wallet config.
 * @returns {Function} Thunk
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
 * @returns {Function} Thunk
 */
export const deleteWallet = () => async (dispatch, getState) => {
  try {
    const walletId = activeWalletSelector(getState())
    if (walletId) {
      dispatch({ type: DELETE_WALLET, walletId })
      dispatch(hideDeleteWalletDialog())
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
 * @returns {Function} Thunk
 */
export const initWallets = () => async dispatch => {
  // Fetch wallet details.
  const dbWallets = await dispatch(getWallets())

  dispatch(setWalletsLoaded())

  // Create wallet entry in the database if one doesn't exist already.
  const { chains, networks } = config
  const fsWallets = await window.Zap.getAllLocalWallets(chains, networks)
  return fsWallets
    .filter(wallet => wallet.wallet !== 'wallet-tmp')
    .forEach(walletDetails => {
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
  [OPEN_DELETE_WALLET_DIALOG]: state => {
    state.isDeleteDialogOpen = true
  },
  [CLOSE_DELETE_WALLET_DIALOG]: state => {
    state.isDeleteDialogOpen = false
  },
  [DELETE_WALLET_FAILURE]: (state, { error }) => {
    state.deleteWalletError = error
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const walletSelectors = {}
const walletsSelector = state => state.wallet.wallets
const activeWalletSelector = state => state.settings.activeWallet
const isWalletsLoadedSelector = state => state.wallet.isWalletsLoaded
const isWalletOpenSelector = state => state.settings.isWalletOpen

walletSelectors.isWalletsLoaded = isWalletsLoadedSelector

walletSelectors.activeWalletDir = createSelector(
  activeWalletSelector,
  walletsSelector,
  (activeWallet, wallets) => {
    const wallet = wallets.find(w => w.id === activeWallet)
    if (wallet && wallet.type === 'local') {
      return window.Zap.getWalletDir(wallet.chain, wallet.network, wallet.wallet)
    }
    return null
  }
)

walletSelectors.wallets = createSelector(
  walletsSelector,
  wallets => wallets
)
walletSelectors.activeWallet = createSelector(
  activeWalletSelector,
  activeWallet => activeWallet
)
walletSelectors.activeWalletSettings = createSelector(
  walletsSelector,
  activeWalletSelector,
  (wallets, activeWallet) => wallets.find(wallet => wallet.id === activeWallet)
)
walletSelectors.hasWallets = createSelector(
  walletSelectors.wallets,
  wallets => wallets.length > 0
)
walletSelectors.isWalletOpen = createSelector(
  isWalletOpenSelector,
  isOpen => isOpen
)
walletSelectors.lndconnectQRCode = createSelector(
  walletSelectors.activeWalletSettings,
  activeWallet => activeWallet.lndconnectQRCode
)

export { walletSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
