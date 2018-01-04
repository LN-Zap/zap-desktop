import { createSelector } from 'reselect'

import filter from 'lodash/filter'

// Initial State
const initialState = {
  isOpen: false,
  searchQuery: '',
  friend: ''
}

// Constants
// ------------------------------------
export const OPEN_FRIENDS_FORM = 'OPEN_FRIENDS_FORM'
export const CLOSE_FRIENDS_FORM = 'CLOSE_FRIENDS_FORM'

export const UPDATE_FRIEND_FORM_SEARCH_QUERY = 'UPDATE_FRIEND_FORM_SEARCH_QUERY'

// ------------------------------------
// Actions
// ------------------------------------
export function openFriendsForm() {
  return {
    type: OPEN_FRIENDS_FORM
  }
}

export function closeFriendsForm() {
  return {
    type: CLOSE_FRIENDS_FORM
  }
}

export function updateFriendFormSearchQuery(searchQuery) {
  return {
    type: UPDATE_FRIEND_FORM_SEARCH_QUERY,
    searchQuery
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_FRIENDS_FORM]: state => ({ ...state, isOpen: true }),
  [CLOSE_FRIENDS_FORM]: state => ({ ...state, isOpen: false }),

  [UPDATE_FRIEND_FORM_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery })
}

// ------------------------------------
// Selector
// ------------------------------------
const friendFormSelectors = {}
const networkNodesSelector = state => state.network.nodes
const searchQuerySelector = state => state.friendsform.searchQuery


friendFormSelectors.filteredNetworkNodes = createSelector(
  networkNodesSelector,
  searchQuerySelector,
  (nodes, searchQuery) => filter(nodes, node => node.alias.includes(searchQuery) || node.pub_key.includes(searchQuery))
)

export { friendFormSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function friendFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
