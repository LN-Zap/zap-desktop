import { createSelector } from 'reselect'
import { showError } from './notification'
import { putSetting } from './settings'

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

export function setWallets(wallets) {
  return {
    type: SET_WALLETS,
    wallets,
  }
}

export function setWalletsLoaded() {
  return {
    type: SET_WALLETS_LOADED,
  }
}

export const getWallets = () => async dispatch => {
  let wallets
  try {
    wallets = await window.db.wallets.toArray()
  } catch (e) {
    wallets = []
  }
  dispatch(setWallets(wallets))
  return wallets
}

export const setActiveWallet = activeWallet => async dispatch => {
  dispatch(putSetting('activeWallet', activeWallet))
}

export const setIsWalletOpen = isWalletOpen => async dispatch => {
  dispatch(putSetting('isWalletOpen', isWalletOpen))
}

export const putWallet = wallet => async dispatch => {
  dispatch({ type: PUT_WALLET, wallet })
  wallet.id = await window.db.wallets.put(wallet)
  await dispatch(getWallets())
  return wallet
}

export const showDeleteWalletDialog = () => ({ type: OPEN_DELETE_WALLET_DIALOG })
export const hideDeleteWalletDialog = () => ({ type: CLOSE_DELETE_WALLET_DIALOG })

export const deleteWallet = () => async (dispatch, getState) => {
  try {
    const walletId = activeWalletSelector(getState())
    if (walletId) {
      dispatch({ type: DELETE_WALLET, walletId })
      dispatch(hideDeleteWalletDialog())
      const state = getState().wallet
      const wallet = state.wallets.find(w => w.id === walletId)

      // Delete the wallet from the filesystem.
      if (wallet.type === 'local') {
        const { chain, network, wallet: walletName } = wallet
        await window.Zap.deleteLocalWallet({ chain, network, wallet: walletName })
      }

      // Delete the wallet from the database.
      await window.db.wallets.delete(walletId)

      // Dispatch success message.
      dispatch({ type: DELETE_WALLET_SUCCESS, walletId })

      // Deselect and close the current wallet.
      await dispatch(setActiveWallet(null))
      await dispatch(setIsWalletOpen(false))

      // Refresh the wallets state data.
      await dispatch(getWallets())
    }
  } catch (error) {
    dispatch(showError(error.message))
    dispatch({ type: DELETE_WALLET_FAILURE, error })
  }
}

export const initWallets = () => async dispatch => {
  // Fetch wallet details.
  const dbWallets = await dispatch(getWallets())

  dispatch(setWalletsLoaded())

  // Create wallet entry in the database if one doesn't exist already.
  const fsWallets = await window.Zap.getAllLocalWallets()
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
  [SET_WALLETS]: (state, { wallets }) => ({ ...state, wallets }),
  [SET_WALLETS_LOADED]: state => ({ ...state, isWalletsLoaded: true }),
  [OPEN_DELETE_WALLET_DIALOG]: state => ({
    ...state,
    isDeleteDialogOpen: true,
  }),
  [CLOSE_DELETE_WALLET_DIALOG]: state => ({
    ...state,
    isDeleteDialogOpen: false,
  }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const walletSelectors = {}
const walletsSelector = state => state.wallet.wallets
const activeWalletSelector = state => state.settings.activeWallet
const isWalletOpenSelector = state => state.settings.isWalletOpen

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

export { walletSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  isWalletsLoaded: false,
  wallets: [],
}

export default function walletReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
