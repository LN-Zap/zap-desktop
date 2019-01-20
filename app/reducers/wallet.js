import { createSelector } from 'reselect'
import get from 'lodash.get'
import db from 'store/db'
import { setError } from './error'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_WALLETS = 'SET_WALLETS'
export const SET_WALLETS_LOADED = 'SET_WALLETS_LOADED'
export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET'
export const SET_IS_WALLET_OPEN = 'SET_IS_WALLET_OPEN'
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
    wallets
  }
}

export function setWalletsLoaded() {
  return {
    type: SET_WALLETS_LOADED
  }
}

export const getWallets = () => async dispatch => {
  let wallets
  try {
    wallets = await db.wallets.toArray()
  } catch (e) {
    wallets = []
  }
  dispatch(setWallets(wallets))
  return wallets
}

export const setActiveWallet = activeWallet => async dispatch => {
  dispatch({
    type: SET_ACTIVE_WALLET,
    activeWallet
  })
  await db.settings.put({
    key: 'activeWallet',
    value: activeWallet
  })
}

export const setIsWalletOpen = isWalletOpen => async dispatch => {
  dispatch({
    type: SET_IS_WALLET_OPEN,
    isWalletOpen
  })
  await db.settings.put({
    key: 'isWalletOpen',
    value: isWalletOpen
  })
}

export const putWallet = wallet => async dispatch => {
  dispatch({ type: PUT_WALLET, wallet })
  wallet.id = await db.wallets.put(wallet)
  await dispatch(getWallets())
  return wallet
}

export const showDeleteWalletDialog = () => ({ type: OPEN_DELETE_WALLET_DIALOG })
export const hideDeleteWalletDialog = () => ({ type: CLOSE_DELETE_WALLET_DIALOG })

export const deleteWallet = () => async (dispatch, getState) => {
  try {
    const {
      wallet: { activeWallet: walletId }
    } = getState()
    if (walletId) {
      dispatch({ type: DELETE_WALLET, walletId })
      dispatch(hideDeleteWalletDialog())
      const state = getState().wallet
      const wallet = state.wallets.find(w => w.id === walletId)

      // Delete the wallet from the filesystem.
      if (wallet.type === 'local') {
        await window.Zap.deleteLocalWallet(wallet.chain, wallet.network, wallet.wallet)
      }

      // Delete the wallet from the database.
      await db.wallets.delete(walletId)

      // Dispatch success message.
      dispatch({ type: DELETE_WALLET_SUCCESS, walletId })

      // Deselect and close the current wallet.
      await dispatch(setActiveWallet(null))
      await dispatch(setIsWalletOpen(false))

      // Refresh the wallets state data.
      await dispatch(getWallets())
    }
  } catch (error) {
    dispatch(setError(error.message))
    dispatch({ type: DELETE_WALLET_FAILURE, error })
  }
}

export const initWallets = () => async dispatch => {
  // Fetch the current wallet settings.
  let [activeWallet, isWalletOpen, dbWallets] = await Promise.all([
    db.settings.get({ key: 'activeWallet' }),
    db.settings.get({ key: 'isWalletOpen' }),
    dispatch(getWallets())
  ])

  activeWallet = get(activeWallet || {}, 'value', null)
  isWalletOpen = get(isWalletOpen || {}, 'value', false)

  dispatch(setIsWalletOpen(isWalletOpen))
  dispatch(setActiveWallet(activeWallet))
  dispatch(setWalletsLoaded())

  // Fetch wallets from the filesystem.
  const supportedChains = ['bitcoin']
  const supportedNetworks = ['testnet', 'mainnet']

  // Create wallet entry in the database if one doesn't exist already.
  supportedChains.forEach(chain => {
    return supportedNetworks.forEach(async network => {
      const fsWallets = await window.Zap.getLocalWallets(chain, network)
      return fsWallets
        .filter(wallet => wallet !== 'wallet-tmp')
        .forEach(wallet => {
          if (
            !dbWallets.find(
              w =>
                w.type === 'local' &&
                w.chain === chain &&
                w.network === network &&
                w.wallet === wallet
            )
          ) {
            const walletDetails = {
              type: 'local',
              chain,
              network,
              wallet
            }
            const id = Number(wallet.split('-')[1])
            if (id && !Number.isNaN(id)) {
              walletDetails.id = id
            }
            dispatch(putWallet(walletDetails))
          }
        })
    })
  })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_WALLETS]: (state, { wallets }) => ({ ...state, wallets }),
  [SET_WALLETS_LOADED]: state => ({ ...state, isWalletsLoaded: true }),
  [SET_ACTIVE_WALLET]: (state, { activeWallet }) => ({ ...state, activeWallet }),
  [SET_IS_WALLET_OPEN]: (state, { isWalletOpen }) => ({ ...state, isWalletOpen }),
  [OPEN_DELETE_WALLET_DIALOG]: state => ({
    ...state,
    isDeleteDialogOpen: true
  }),
  [CLOSE_DELETE_WALLET_DIALOG]: state => ({
    ...state,
    isDeleteDialogOpen: false
  })
}

// ------------------------------------
// Selectors
// ------------------------------------

const walletSelectors = {}
const activeWalletSelector = state => state.wallet.activeWallet
const walletsSelector = state => state.wallet.wallets

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

export { walletSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  isWalletsLoaded: false,
  isWalletOpen: false,
  activeWallet: null,
  wallets: []
}

export default function walletReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
