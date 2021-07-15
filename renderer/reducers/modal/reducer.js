import matches from 'lodash/matches'

import createReducer from '@zap/utils/createReducer'
import genId from '@zap/utils/genId'

import * as constants from './constants'
import modalSelectors from './selectors'

const {
  OPEN_MODAL,
  CLOSE_MODAL,
  CLOSE_ALL_MODALS,
  SET_MODALS,
  SET_TOP_MODAL,
  OPEN_DIALOG,
  CLOSE_DIALOG,
} = constants

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  modals: [],
  dialogs: {},
}

// ------------------------------------
// Helpers
// ------------------------------------
//
/**
 * createModalData - Create base data for new modal.
 *
 * @param {string} type Modal type
 * @param {object} options Modal options
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
 * openDialog - Open dialog.
 *
 * @param {string} id Name of modal to open
 * @returns {(dispatch:Function) => void} Thunk
 */
export const openDialog = id => dispatch => {
  dispatch({
    type: OPEN_DIALOG,
    id,
  })
}

/**
 * closeDialog - Close specified dialog.
 *
 * @param {string} id Name of modal to open
 * @returns {(dispatch:Function) => void} Thunk
 */
export const closeDialog = id => dispatch => {
  dispatch({
    type: CLOSE_DIALOG,
    id,
  })
}

/**
 * openModal - Open a specific modal.
 *
 * @param {string} type Name of modal to open
 * @param {object} [options] Options to apply to the modal
 * @returns {(dispatch:Function, getState:Function) => void} Thunk
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
 * @param {string} id Id modal to close
 * @returns {object} Action
 */
export function closeModal(id) {
  return {
    type: CLOSE_MODAL,
    id,
  }
}

/**
 * closeModal - Close all modals that match the supplied predicate.
 *
 * @param {object} predicate Set of attributes used to find modals to close
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
 * setModals - Set the list of current open modals.
 *
 * @param {Array} modalList List of modals
 * @returns {object} Action
 */
export function setModals(modalList = []) {
  const modals = modalList.map(({ type, options }) => createModalData(type, options))
  return {
    type: SET_MODALS,
    modals,
  }
}

/**
 * setTopModal - Set the top modal.
 *
 * @param {string} type Name of modal to open
 * @param {object} [options] Options to apply to the modal
 * @returns {object} Action
 */
export function setTopModal(type, options) {
  return {
    type: SET_TOP_MODAL,
    modal: createModalData(type, options),
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
  [SET_TOP_MODAL]: (state, { modal }) => {
    state.modals[0] = modal
  },
  [OPEN_DIALOG]: (state, { id }) => {
    state.dialogs[id] = true
  },
  [CLOSE_DIALOG]: (state, { id }) => {
    delete state.dialogs[id]
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
