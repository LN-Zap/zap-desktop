// Initial State
const initialState = {
  formType: null
}

// Constants
// ------------------------------------
export const SET_FORM_TYPE = 'SET_FORM_TYPE'

// ------------------------------------
// Actions
// ------------------------------------
export function setFormType(formType) {
  return {
    type: SET_FORM_TYPE,
    formType
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_FORM_TYPE]: (state, { formType }) => ({ ...state, formType })
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function formReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
