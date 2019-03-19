import { createSelector } from 'reselect'
import { tickerSelectors } from './ticker'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  isLoading: true,
  isMounted: false,
}

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOADING = 'SET_LOADING'
export const SET_MOUNTED = 'SET_MOUNTED'
export const RESET_APP = 'RESET_APP'

// ------------------------------------
// Actions
// ------------------------------------
export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading,
  }
}

export function setMounted(isMounted) {
  return {
    type: SET_MOUNTED,
    isMounted,
  }
}

export function resetApp() {
  return {
    type: RESET_APP,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_LOADING]: (state, { isLoading }) => ({ ...state, isLoading }),
  [SET_MOUNTED]: (state, { isMounted }) => ({ ...state, isMounted }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const appSelectors = {}
appSelectors.isLoading = state => state.app.isLoading
appSelectors.isMounted = state => state.app.isMounted
appSelectors.currency = state => state.ticker.currency
appSelectors.infoLoaded = state => state.info.infoLoaded
appSelectors.onboarding = state => state.onboarding.onboarding
appSelectors.isWalletsLoaded = state => state.wallet.isWalletsLoaded
appSelectors.walletBalance = state => state.balance.walletBalance
appSelectors.channelBalance = state => state.balance.channelBalance

appSelectors.isRootReady = createSelector(
  appSelectors.onboarding,
  appSelectors.isWalletsLoaded,
  (onboarding, isWalletsLoaded) => {
    return Boolean(onboarding && isWalletsLoaded)
  }
)

appSelectors.isAppReady = createSelector(
  appSelectors.infoLoaded,
  tickerSelectors.currency,
  tickerSelectors.currentTicker,
  appSelectors.walletBalance,
  appSelectors.channelBalance,
  (infoLoaded, currency, currentTicker, walletBalance, channelBalance) => {
    return Boolean(
      infoLoaded && currency && currentTicker && channelBalance !== null && walletBalance !== null
    )
  }
)

export { appSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function loadingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
