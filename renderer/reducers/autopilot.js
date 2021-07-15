import { requestNodeScores } from '@zap/utils/api'
import createReducer from '@zap/utils/createReducer'
import { grpc } from 'workers'

import { infoSelectors } from './info'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isFetchingNodeScores: false,
  fetchNodeScoresError: null,
  scores: {},
}

// ------------------------------------
// Constants
// ------------------------------------

export const UPDATE_AUTOPILOT_NODE_SCORES = 'UPDATE_AUTOPILOT_NODE_SCORES'
export const UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS = 'UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS'
export const UPDATE_AUTOPILOT_NODE_SCORES_FAILURE = 'UPDATE_AUTOPILOT_NODE_SCORES_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * updateAutopilotNodeScores - Fetch autopilot node scores.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const updateAutopilotNodeScores = () => async (dispatch, getState) => {
  const state = getState()

  // Only apply node scores to local nodes where autopilot is enabled.
  const { type, autopilot } = state.lnd.lndConfig
  if (type !== 'local' || !autopilot) {
    return
  }

  try {
    dispatch({ type: UPDATE_AUTOPILOT_NODE_SCORES })

    const chain = infoSelectors.chainSelector(state)
    const network = infoSelectors.networkSelector(state)
    const scores = await requestNodeScores(chain, network)
    if (!scores) {
      throw new Error('Node scores empty')
    }
    await grpc.services.Autopilot.setScores({
      heuristic: 'externalscore',
      scores,
    })
    dispatch({ type: UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS, scores })
  } catch (error) {
    dispatch({ type: UPDATE_AUTOPILOT_NODE_SCORES_FAILURE, error: error.message })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [UPDATE_AUTOPILOT_NODE_SCORES]: state => {
    state.isFetchingNodeScores = true
  },
  [UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS]: (state, { scores }) => {
    state.scores = scores
    state.isFetchingNodeScores = false
  },
  [UPDATE_AUTOPILOT_NODE_SCORES_FAILURE]: (state, { error }) => {
    state.isFetchingNodeScores = false
    state.fetchNodeScoresError = error
  },
}

export default createReducer(initialState, ACTION_HANDLERS)
