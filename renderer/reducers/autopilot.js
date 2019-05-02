import { grpcService } from 'workers'
import { requestNodeScores } from '@zap/utils/api'
import { infoSelectors } from './info'

// ------------------------------------
// Constants
// ------------------------------------

export const UPDATE_AUTOPILOT_NODE_SCORES = 'UPDATE_AUTOPILOT_NODE_SCORES'
export const UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS = 'UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS'
export const UPDATE_AUTOPILOT_NODE_SCORES_FAILURE = 'UPDATE_AUTOPILOT_NODE_SCORES_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

// Fetch autopilot node scores.
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
    const grpc = await grpcService
    await grpc.services.Autopilot.setScores({
      heuristic: 'externalscore',
      scores,
    })
    dispatch({ type: UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS, scores })
  } catch (error) {
    dispatch({ type: UPDATE_AUTOPILOT_NODE_SCORES_FAILURE, error })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [UPDATE_AUTOPILOT_NODE_SCORES]: state => ({ ...state, isBalanceLoading: true }),
  [UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS]: (state, { scores }) => ({ ...state, scores }),
  [UPDATE_AUTOPILOT_NODE_SCORES_FAILURE]: (state, { error }) => ({
    ...state,
    isFetchingNodeScores: false,
    fetchNodeScoresError: error,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isFetchingNodeScores: false,
  fetchNodeScoresError: null,
  scores: {},
}

export default function autopilotReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
