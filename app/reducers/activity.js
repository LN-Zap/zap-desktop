import { callApis } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_ACTIVITY = 'GET_ACTIVITY'
export const RECEIVE_ACTIVITY = 'RECEIVE_ACTIVITY'

// ------------------------------------
// Actions
// ------------------------------------
export function getActivity() {
  return {
    type: GET_ACTIVITY
  }
}

export function receiveActvity(data) {
  return {
    type: RECEIVE_ACTIVITY,
    payments: data[0].data.payments,
    invoices: data[1].data.invoices 
  }
}

export const fetchActivity = () => async (dispatch) => {
  dispatch(getActivity())
  const activity = await callApis(['payments', 'invoices'])
  dispatch(receiveActvity(activity))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_ACTIVITY]: (state) => ({ ...state, activityLoading: true }),
  [RECEIVE_ACTIVITY]: (state, { payments, invoices }) => ({ ...state, activityLoading: false, payments, invoices })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  activityLoading: false,
  payments: [],
  invoices: []
}

export default function activityReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}