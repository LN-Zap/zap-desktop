import genId from 'lib/utils/genId'

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

// ------------------------------------
// Actions
// ------------------------------------
export function openModal(type) {
  const modal = {
    id: genId(),
    type,
  }
  return {
    type: OPEN_MODAL,
    modal,
  }
}

export function closeModal(id) {
  return {
    type: CLOSE_MODAL,
    id,
  }
}

export function closeAllModals() {
  return {
    type: CLOSE_ALL_MODALS,
  }
}

export function setModals(modalList = []) {
  const modals = modalList.map(type => ({
    id: genId(),
    type,
  }))
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
