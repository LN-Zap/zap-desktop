import matches from 'lodash.matches'

import genId from '@zap/utils/genId'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  modals: [],
}

// ------------------------------------
// Constants
// ------------------------------------
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const CLOSE_ALL_MODALS = 'CLOSE_ALL_MODALS'
export const SET_MODALS = 'SET_MODALS'

const createModalData = (type, options) => ({ id: genId(), type, options })
// ------------------------------------
// Actions
// ------------------------------------
export function openModal(type, options) {
  return {
    type: OPEN_MODAL,
    modal: createModalData(type, options),
  }
}

export function closeModal(id) {
  return {
    type: CLOSE_MODAL,
    id,
  }
}

export function closeAllModals(predicate) {
  return (dispatch, getState) => {
    // returns a specific list of modal ids that have to be closed
    // or undefined if the entire modal stack needs to be cleared
    const getIdsToClose = () => {
      if (!predicate) {
        return undefined
      }
      const state = getState().modal
      // find all modal ids that match predicate
      const matcher = matches(predicate)
      return state.modals.filter(matcher).map(m => m.id)
    }

    // Check if there is a specific list of modals to close
    const ids = getIdsToClose()
    if (ids) {
      ids.map(id => dispatch(closeModal(id)))
    }
    // Otherwise close all
    else {
      dispatch({
        type: CLOSE_ALL_MODALS,
        ids,
      })
    }
  }
}

export function setModals(modalList = []) {
  const modals = modalList.map(({ type, options }) => createModalData(type, options))
  return {
    type: SET_MODALS,
    modals,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_MODAL]: (state, { modal }) => ({
    ...state,
    modals: [...state.modals, modal],
  }),
  [CLOSE_MODAL]: (state, { id }) => {
    if (id) {
      return {
        ...state,
        modals: state.modals.filter(item => item.id !== id),
      }
    }
    return {
      ...state,
      modals: [...state.modals.slice(0, -1)],
    }
  },
  [CLOSE_ALL_MODALS]: state => ({
    ...state,
    modals: [],
  }),
  [SET_MODALS]: (state, { modals }) => ({
    ...state,
    modals,
  }),
}

// ------------------------------------
// Selectors
// ------------------------------------

const modalSelectors = {}
modalSelectors.getModalState = state => state.modal.modals

export { modalSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function modalReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
