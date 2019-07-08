import produce from 'immer'

/**
 * createReducer - Creates immer compatible reducer.
 *
 * @param {object} initialState
 * @param {object} actionHandlers
 * @returns {Function} immer compatible reducer function
 */
const createReducer = (initialState, actionHandlers) => (state = initialState, action) => {
  return produce(state, draft => {
    const handler = actionHandlers[action.type]
    handler && handler(draft, action)
  })
}

export default createReducer
