import matches from 'lodash/matches'
import genId from '@zap/utils/genId'
import createReducer from './utils/createReducer'
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
// Helpers
// ------------------------------------
//
/**
 * createModalData - Create base data for new modal.
 *
 * @param  {string} type Modal type
 * @param  {object} options Modal options
 * @returns {object} Base data for new modal
 */
const createModalData = (type, options) => ({
  id: genId(),
  type,
  options,
})

// ------------------------------------
// Actions
// ------------------------------------

/**
 * openModal - Open a specific modal.
 *
 * @param  {string} type Name of modal to open
 * @param  {object} options Options to apply to the modal
 * @returns {Function} Thunk
 */
export const openModal = (type, options) => (dispatch, getState) => {
  const modals = modalSelectors.getModalState(getState())
  if (!modals.find(m => m.type === type)) {
    dispatch({
      type: OPEN_MODAL,
      modal: createModalData(type, options),
    })
  }
}

/**
 * closeModal - Close a specific modal (or the top modal if id is ommitted).
 *
 * @param  {string} id Id modal to close
 * @returns {object} Action
 */
export function closeModal(id) {
  return {
    type: CLOSE_MODAL,
    id,
  }
}

/**
 * closeModal - Close a specific modal (or the top modal if id is ommitted).
 *
 * @param  {object} predicate Set of attributes used to find modals to close
 * @returns {object} Action
 */
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

/**
 * setModals - The list of current open modals.
 *
 * @param  {Array} modalList List of modals
 * @returns {object} Action
 */
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
  [OPEN_MODAL]: (state, { modal }) => {
    state.modals.push(modal)
  },
  [CLOSE_MODAL]: (state, { id }) => {
    if (id) {
      state.modals = state.modals.filter(item => item.id !== id)
    } else {
      state.modals.pop()
    }
  },
  [CLOSE_ALL_MODALS]: state => {
    state.modals = []
  },
  [SET_MODALS]: (state, { modals }) => {
    state.modals = modals
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const modalSelectors = {}
modalSelectors.getModalState = state => state.modal.modals

export { modalSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
