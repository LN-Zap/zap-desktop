import { send } from 'redux-electron-ipc'
import { createSelector } from 'reselect'
import { neutrinoService } from 'workers'
import { proxyValue } from 'comlinkjs'
import { showSystemNotification } from '@zap/utils/notifications'

// ------------------------------------
// Constants
// ------------------------------------

export const START_NEUTRINO = 'START_NEUTRINO'
export const START_NEUTRINO_SUCCESS = 'START_NEUTRINO_SUCCESS'
export const START_NEUTRINO_FAILURE = 'START_NEUTRINO_FAILURE'

export const STOP_NEUTRINO = 'STOP_NEUTRINO'
export const STOP_NEUTRINO_SUCCESS = 'STOP_NEUTRINO_SUCCESS'
export const STOP_NEUTRINO_FAILURE = 'STOP_NEUTRINO_FAILURE'

export const RECEIVE_CURRENT_BLOCK_HEIGHT = 'RECEIVE_CURRENT_BLOCK_HEIGHT'
export const RECEIVE_LND_BLOCK_HEIGHT = 'RECEIVE_LND_BLOCK_HEIGHT'
export const RECEIVE_LND_CFILTER_HEIGHT = 'RECEIVE_LND_CFILTER_HEIGHT'

export const SET_SYNC_STATUS_PENDING = 'SET_SYNC_STATUS_PENDING'
export const SET_SYNC_STATUS_WAITING = 'SET_SYNC_STATUS_WAITING'
export const SET_SYNC_STATUS_IN_PROGRESS = 'SET_SYNC_STATUS_IN_PROGRESS'
export const SET_SYNC_STATUS_COMPLETE = 'SET_SYNC_STATUS_COMPLETE'

export const SET_GRPC_ACTIVE_INTERFACE = 'SET_GRPC_ACTIVE_INTERFACE'

export const NEUTRINO_CRASHED = 'NEUTRINO_CRASHED'
export const NEUTRINO_RESET = 'NEUTRINO_RESET'

// ------------------------------------
// Actions
// ------------------------------------

export const setGrpcActiveInterface = grpcActiveInterface => {
  return {
    type: SET_GRPC_ACTIVE_INTERFACE,
    grpcActiveInterface,
  }
}

export const neutrinoCrashed = ({ code, signal, lastError }) => {
  return {
    type: NEUTRINO_CRASHED,
    code,
    signal,
    lastError,
  }
}

export const neutrinoReset = () => {
  return {
    type: NEUTRINO_RESET,
  }
}

export const initNeutrino = () => async (dispatch, getState) => {
  const neutrino = await neutrinoService

  // Hook up event listeners error/exit.
  neutrino.on(
    'NEUTRINO_EXIT',
    proxyValue(data => {
      dispatch(send('processExit', { name: 'neutrino', ...data }))
      const { isStoppingNeutrino } = getState().neutrino
      if (!isStoppingNeutrino) {
        dispatch(neutrinoCrashed(data))
      }
    })
  )
  // Hook up event listeners for sync progress updates.
  neutrino.on(
    'NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT',
    proxyValue(height => dispatch(currentBlockHeight(height)))
  )
  neutrino.on(
    'NEUTRINO_GOT_LND_BLOCK_HEIGHT',
    proxyValue(height => dispatch(neutrinoBlockHeight(height)))
  )
  neutrino.on(
    'NEUTRINO_GOT_LND_CFILTER_HEIGHT',
    proxyValue(height => dispatch(neutrinoCfilterHeight(height)))
  )
  // Hook up event listeners for sync status updates.
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_PENDING',
    proxyValue(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_PENDING')))
  )
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_WAITING',
    proxyValue(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_WAITING')))
  )
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_IN_PROGRESS',
    proxyValue(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_IN_PROGRESS')))
  )
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_COMPLETE',
    proxyValue(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_COMPLETE')))
  )
}

export const startNeutrino = lndConfig => async dispatch => {
  dispatch({ type: START_NEUTRINO })
  try {
    // Initialise the Neutrino Web Worker..
    const neutrino = await neutrinoService
    await neutrino.init(lndConfig)

    // Start the service and wait for one of the gRPC interfaces to become active.
    await new Promise(async resolve => {
      neutrino.once(
        'NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE',
        proxyValue(() => {
          dispatch(setGrpcActiveInterface('walletUnlocker'))
          resolve()
        })
      )
      neutrino.once(
        'NEUTRINO_LIGHTNING_GRPC_ACTIVE',
        proxyValue(() => {
          dispatch(setGrpcActiveInterface('lightning'))
          resolve()
        })
      )
      const pid = await neutrino.start()
      dispatch(send('processSpawn', { name: 'neutrino', pid }))
    })
    dispatch({ type: START_NEUTRINO_SUCCESS })
  } catch (e) {
    dispatch({ type: START_NEUTRINO_FAILURE, startNeutrinoError: e })
  }
}

export const stopNeutrino = () => async dispatch => {
  dispatch({ type: STOP_NEUTRINO })
  try {
    const neutrino = await neutrinoService
    await neutrino.kill()
    neutrino.once(
      'NEUTRINO_EXIT',
      proxyValue(() => {
        dispatch(stopNeutrinoSuccess())
      })
    )
  } catch (e) {
    dispatch(stopNeutrinoFailure(e))
  }
}

export const stopNeutrinoSuccess = () => {
  return { type: STOP_NEUTRINO_SUCCESS }
}

export const stopNeutrinoFailure = stopNeutrinoError => {
  return { type: STOP_NEUTRINO_SUCCESS, stopNeutrinoError }
}

// Receive IPC event for current height.
export const currentBlockHeight = height => dispatch => {
  dispatch({ type: RECEIVE_CURRENT_BLOCK_HEIGHT, blockHeight: height })
}

// Receive IPC event for LND block height.
export const neutrinoBlockHeight = height => dispatch => {
  dispatch({ type: RECEIVE_LND_BLOCK_HEIGHT, neutrinoBlockHeight: height })
}

// Receive IPC event for LND cfilter height.
export const neutrinoCfilterHeight = height => dispatch => {
  dispatch({ type: RECEIVE_LND_CFILTER_HEIGHT, neutrinoCfilterHeight: height })
}

// Receive IPC event for LND sync status change.
export const neutrinoSyncStatus = status => async dispatch => {
  const notifTitle = 'Lightning Node Synced'
  const notifBody = "Visa who? You're your own payment processor now!"

  switch (status) {
    case 'NEUTRINO_CHAIN_SYNC_WAITING':
      dispatch({ type: SET_SYNC_STATUS_WAITING })
      break
    case 'NEUTRINO_CHAIN_SYNC_IN_PROGRESS':
      dispatch({ type: SET_SYNC_STATUS_IN_PROGRESS })
      break
    case 'NEUTRINO_CHAIN_SYNC_COMPLETE':
      dispatch({ type: SET_SYNC_STATUS_COMPLETE })

      // // Fetch data now that we know LND is synced
      // dispatch(fetchInfo())
      // dispatch(fetchBalance())

      // Persist the fact that the wallet has been synced at least once.
      // dispatch(setHasSynced(true))

      // HTML 5 desktop notification for the new transaction
      showSystemNotification(notifTitle, notifBody)
      break
    case 'NEUTRINO_CHAIN_SYNC_PENDING':
      dispatch({ type: SET_SYNC_STATUS_PENDING })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_NEUTRINO]: state => ({
    ...state,
    isStartingNeutrino: true,
    startNeutrinoError: null,
  }),
  [START_NEUTRINO_SUCCESS]: state => ({
    ...state,
    isStartingNeutrino: false,
    isNeutrinoRunning: true,
    startNeutrinoError: null,
  }),
  [START_NEUTRINO_FAILURE]: (state, { startNeutrinoError }) => ({
    ...state,
    isStartingNeutrino: false,
    startNeutrinoError,
  }),

  [STOP_NEUTRINO]: state => ({
    ...state,
    isStoppingNeutrino: true,
    stopNeutrinoError: null,
  }),
  [STOP_NEUTRINO_SUCCESS]: state => ({
    ...state,
    ...initialState,
  }),
  [STOP_NEUTRINO_FAILURE]: (state, { stopNeutrinoError }) => ({
    ...state,
    ...initialState,
    stopNeutrinoError,
  }),

  [RECEIVE_CURRENT_BLOCK_HEIGHT]: (state, { blockHeight }) => ({
    ...state,
    blockHeight,
  }),
  [RECEIVE_LND_BLOCK_HEIGHT]: (state, { neutrinoBlockHeight }) => ({
    ...state,
    neutrinoBlockHeight,
    neutrinoFirstBlockHeight: state.neutrinoFirstBlockHeight || neutrinoBlockHeight,
  }),
  [RECEIVE_LND_CFILTER_HEIGHT]: (state, { neutrinoCfilterHeight }) => ({
    ...state,
    neutrinoCfilterHeight,
    neutrinoFirstCfilterHeight: state.neutrinoFirstCfilterHeight || neutrinoCfilterHeight,
  }),

  [SET_SYNC_STATUS_PENDING]: state => ({ ...state, syncStatus: 'pending' }),
  [SET_SYNC_STATUS_WAITING]: state => ({ ...state, syncStatus: 'waiting' }),
  [SET_SYNC_STATUS_IN_PROGRESS]: state => ({ ...state, syncStatus: 'in-progress' }),
  [SET_SYNC_STATUS_COMPLETE]: state => ({ ...state, syncStatus: 'complete' }),

  [SET_GRPC_ACTIVE_INTERFACE]: (state, { grpcActiveInterface }) => ({
    ...state,
    grpcActiveInterface,
  }),

  [NEUTRINO_CRASHED]: (state, { code, signal, lastError }) => ({
    ...state,
    ...initialState,
    isNeutrinoCrashed: true,
    neutrinoCrashCode: code,
    neutrinoCrashSignal: signal,
    neutrinoCrashLastError: lastError,
  }),

  [NEUTRINO_RESET]: state => ({
    ...state,
    ...initialState,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isNeutrinoRunning: false,
  isStartingNeutrino: false,
  isStoppingNeutrino: false,
  isNeutrinoCrashed: false,
  grpcActiveInterface: null,
  blockHeight: 0,
  neutrinoFirstBlockHeight: 0,
  neutrinoBlockHeight: 0,
  neutrinoFirstCfilterHeight: 0,
  neutrinoCfilterHeight: 0,
  startNeutrinoError: null,
  stopNeutrinoError: null,
  neutrinoCrashCode: null,
  neutrinoCrashSignal: null,
  neutrinoCrashLastError: null,
  syncStatus: 'pending',
}

// ------------------------------------
// Selectors
// ------------------------------------
const isStartingNeutrinoSelector = state => state.neutrino.isStartingNeutrino
const isNeutrinoRunningSelector = state => state.neutrino.isNeutrinoRunning
const neutrinoSyncStatusSelector = state => state.neutrino.syncStatus
const blockHeightSelector = state => state.neutrino.blockHeight
const neutrinoBlockHeightSelector = state => state.neutrino.neutrinoBlockHeight
const neutrinoFirstBlockHeightSelector = state => state.neutrino.neutrinoFirstBlockHeight
const neutrinoCfilterHeightSelector = state => state.neutrino.neutrinoCfilterHeight
const neutrinoFirstCfilterHeightSelector = state => state.neutrino.neutrinoFirstCfilterHeight
const isNeutrinoCrashedSelector = state => state.neutrino.isNeutrinoCrashed
const neutrinoCrashCodeSelector = state => state.neutrino.neutrinoCrashCode
const neutrinoCrashSignalSelector = state => state.neutrino.neutrinoCrashSignal
const neutrinoCrashLastErrorSelector = state => state.neutrino.neutrinoCrashLastError

const neutrinoSelectors = {}
neutrinoSelectors.isStartingNeutrino = isStartingNeutrinoSelector
neutrinoSelectors.isNeutrinoRunning = isNeutrinoRunningSelector
neutrinoSelectors.neutrinoSyncStatus = neutrinoSyncStatusSelector
neutrinoSelectors.blockHeight = blockHeightSelector
neutrinoSelectors.neutrinoBlockHeight = neutrinoBlockHeightSelector
neutrinoSelectors.neutrinoCfilterHeight = neutrinoCfilterHeightSelector

neutrinoSelectors.neutrinoSyncPercentage = createSelector(
  blockHeightSelector,
  neutrinoBlockHeightSelector,
  neutrinoFirstBlockHeightSelector,
  neutrinoCfilterHeightSelector,
  neutrinoFirstCfilterHeightSelector,
  (
    blockHeight,
    neutrinoBlockHeight,
    neutrinoFirstBlockHeight,
    neutrinoCfilterHeight,
    neutrinoFirstCfilterHeight
  ) => {
    // blocks
    const blocksToSync = blockHeight - neutrinoFirstBlockHeight
    const blocksRemaining = blockHeight - neutrinoBlockHeight
    const blocksDone = blocksToSync - blocksRemaining

    // filters
    const filtersToSync = blockHeight - neutrinoFirstCfilterHeight
    const filtersRemaining = blockHeight - neutrinoCfilterHeight
    const filtersDone = filtersToSync - filtersRemaining

    // totals
    const totalToSync = blocksToSync + filtersToSync
    const done = blocksDone + filtersDone

    const percentage = Math.floor((done / totalToSync) * 100)

    if (percentage === Infinity || Number.isNaN(percentage)) {
      return undefined
    }

    return parseInt(percentage, 10)
  }
)

neutrinoSelectors.isNeutrinoCrashed = isNeutrinoCrashedSelector

neutrinoSelectors.neutrinoCrashReason = createSelector(
  neutrinoCrashCodeSelector,
  neutrinoCrashSignalSelector,
  neutrinoCrashLastErrorSelector,
  (code, signal, error) => ({
    code,
    signal,
    error,
  })
)

export { neutrinoSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
//
export default function neutrinoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
