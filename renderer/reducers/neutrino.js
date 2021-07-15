import { proxy } from 'comlink'
import { send } from 'redux-electron-ipc'
import { createSelector } from 'reselect'

import { getIntl } from '@zap/i18n'
import createReducer from '@zap/utils/createReducer'
import { showSystemNotification } from '@zap/utils/notifications'
import { neutrino } from 'workers'

import { setHasSynced } from './info'
import messages from './messages'

// ------------------------------------
// Initial State
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
  neutrinoRecoveryHeight: 0,
  neutrinoFirstRecoveryHeight: 0,
  startNeutrinoError: null,
  stopNeutrinoError: null,
  neutrinoCrashCode: null,
  neutrinoCrashSignal: null,
  neutrinoCrashLastError: null,
  syncStatus: 'pending',
}

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
export const RECEIVE_LND_RECOVERY_HEIGHT = 'RECEIVE_LND_RECOVERY_HEIGHT'

export const SET_SYNC_STATUS_PENDING = 'SET_SYNC_STATUS_PENDING'
export const SET_SYNC_STATUS_WAITING = 'SET_SYNC_STATUS_WAITING'
export const SET_SYNC_STATUS_IN_PROGRESS = 'SET_SYNC_STATUS_IN_PROGRESS'
export const SET_SYNC_STATUS_RECOVERING = 'SET_SYNC_STATUS_RECOVERING'
export const SET_SYNC_STATUS_COMPLETE = 'SET_SYNC_STATUS_COMPLETE'

export const SET_GRPC_ACTIVE_INTERFACE = 'SET_GRPC_ACTIVE_INTERFACE'

export const NEUTRINO_CRASHED = 'NEUTRINO_CRASHED'
export const NEUTRINO_RESET = 'NEUTRINO_RESET'

const SYNC_DEBOUNCE = {
  wait: 500,
  maxWait: 1000,
}

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * parseHeightUpdates - Get the first and last e4ntry in a list of block heights.
 *
 * @param {Array} data List of height updates
 * @returns {{ first, last }} First and last height in list
 */
const parseHeightUpdates = data => {
  if (!data || !data.length) {
    return {}
  }
  const { height: first } = data[0]
  const { height: last } = data[data.length - 1]
  return { first, last }
}

// ------------------------------------
// IPC
// ------------------------------------

/**
 * killNeutrino - IPC handler for 'killNeutrino' message.
 *
 * @param {object} event Event
 * @param {string} signal Kill signal
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const killNeutrino = (event, signal) => async dispatch => {
  await neutrino.shutdown({ signal })
  dispatch(send('killNeutrinoSuccess'))
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * setGrpcActiveInterface - Set the current grpc active interface.
 *
 * @param {string} grpcActiveInterface Name of currently active interace
 * @returns {object} Action
 */
export const setGrpcActiveInterface = grpcActiveInterface => {
  return {
    type: SET_GRPC_ACTIVE_INTERFACE,
    grpcActiveInterface,
  }
}

/**
 * neutrinoCrashed - Signal a neutrino crash.
 *
 * @param {object} options Options
 * @param {string} options.code Exit code
 * @param {string} options.lastError Last message output to lnd's stderror stream
 * @param {string} options.signal Exit signal
 * @returns {object} Action
 */
export const neutrinoCrashed = ({ code, signal, lastError }) => {
  return {
    type: NEUTRINO_CRASHED,
    code,
    signal,
    lastError,
  }
}

/**
 * neutrinoReset - Reset Neutrino reducer to its initial state.
 *
 * @returns {object} Action
 */
export const neutrinoReset = () => {
  return {
    type: NEUTRINO_RESET,
  }
}

/**
 * initNeutrino - Initialise neutrino service.
 * Attaches event handlers.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const initNeutrino = () => async (dispatch, getState) => {
  neutrino.on(
    'NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE',
    proxy(() => {
      dispatch(setGrpcActiveInterface('walletUnlocker'))
    })
  )
  neutrino.on(
    'NEUTRINO_LIGHTNING_GRPC_ACTIVE',
    proxy(() => {
      dispatch(setGrpcActiveInterface('lightning'))
    })
  )

  // Hook up event listeners for process termination.
  neutrino.on(
    'NEUTRINO_EXIT',
    proxy(data => {
      // Notify the main process that the process has terminated.
      dispatch(send('processExit', { name: 'neutrino', ...data }))

      // If the netrino process didn't terminate as a result of us asking it TO stop then it must have crashed.
      const { isStoppingNeutrino } = getState().neutrino
      if (!isStoppingNeutrino) {
        dispatch(neutrinoCrashed(data))
      }
    })
  )

  // Hook up event listeners for sync progress updates.
  neutrino.on(
    'NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT',
    proxy(height => dispatch(currentBlockHeight(height)))
  )
  neutrino.on(
    'NEUTRINO_GOT_LND_BLOCK_HEIGHT',
    proxy(height => dispatch(neutrinoBlockHeight(height)))
  )
  neutrino.on(
    'NEUTRINO_GOT_LND_CFILTER_HEIGHT',
    proxy(height => dispatch(neutrinoCfilterHeight(height)))
  )
  neutrino.on(
    'NEUTRINO_GOT_WALLET_RECOVERY_HEIGHT',
    proxy(height => dispatch(neutrinoRecoveryHeight(height)))
  )

  // Hook up event listeners for sync status updates.
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_PENDING',
    proxy(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_PENDING')))
  )
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_WAITING',
    proxy(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_WAITING')))
  )
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_IN_PROGRESS',
    proxy(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_IN_PROGRESS')))
  )
  neutrino.on(
    'NEUTRINO_WALLET_RECOVERY_IN_PROGRESS',
    proxy(() => dispatch(neutrinoSyncStatus('NEUTRINO_WALLET_RECOVERY_IN_PROGRESS')))
  )
  neutrino.on(
    'NEUTRINO_CHAIN_SYNC_COMPLETE',
    proxy(() => dispatch(neutrinoSyncStatus('NEUTRINO_CHAIN_SYNC_COMPLETE')))
  )
}

/**
 * startNeutrino - Start neutrino process.
 *
 * @param {object} lndConfig Lnd config instance
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const startNeutrino = lndConfig => async (dispatch, getState) => {
  const { isStartingNeutrino } = getState().neutrino
  if (isStartingNeutrino) {
    return
  }

  dispatch({ type: START_NEUTRINO })
  try {
    // Initialise the Neutrino service.
    await neutrino.init(lndConfig)

    const waitForWalletUnlocker = new Promise((resolve, reject) => {
      // If the services shuts down in the middle of starting up, abort the start process.
      neutrino.on(
        'NEUTRINO_SHUTDOWN',
        proxy(() => {
          neutrino.removeAllListeners('NEUTRINO_SHUTDOWN')
          reject(new Error('Nuetrino was shut down mid-startup.'))
        })
      )
      // Resolve as soon as the wallet unlocker interfave is active.
      neutrino.on(
        'NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE',
        proxy(() => {
          neutrino.removeAllListeners('NEUTRINO_SHUTDOWN')
          resolve()
        })
      )
    })

    const pid = await neutrino.start()

    // Notify the main process of the pid of the active lnd process.
    // This allows the main process to force terminate the process if it needs to.
    dispatch(send('processSpawn', { name: 'neutrino', pid }))

    // Wait for the wallet unlocker service to become available before notifying of a successful start.
    await waitForWalletUnlocker
    dispatch(startNeutrinoSuccess())
  } catch (error) {
    dispatch(startNeutrinoFailure(error))

    // Rethrow the error so that callers of this method are able to handle errors themselves.
    throw error
  } finally {
    // Finally, Remove the shutdown listener.
    neutrino.removeAllListeners('NEUTRINO_SHUTDOWN')
  }
}

/**
 * startNeutrinoSuccess - Start neutrino success handler.
 *
 * @returns {object} Action
 */
export const startNeutrinoSuccess = () => {
  return { type: START_NEUTRINO_SUCCESS }
}

/**
 * startNeutrinoFailure - Start neutrino error handler.
 *
 * @param {string} startNeutrinoError Error message
 * @returns {object} Action
 */
export const startNeutrinoFailure = startNeutrinoError => {
  return { type: START_NEUTRINO_FAILURE, startNeutrinoError }
}

/**
 * stopNeutrino - Stop neutrino process.
 *
 * @returns {(dispatch:Function, getState:Function) => Promise<void>} Thunk
 */
export const stopNeutrino = () => async (dispatch, getState) => {
  const { isStoppingNeutrino } = getState().neutrino
  if (isStoppingNeutrino) {
    return
  }

  dispatch({ type: STOP_NEUTRINO })

  try {
    // Remove grpc interface activation listeners prior to shutdown.
    neutrino.removeAllListeners('NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE')
    neutrino.removeAllListeners('NEUTRINO_LIGHTNING_GRPC_ACTIVE')

    // Shut down the service.
    await neutrino.shutdown()

    dispatch({ type: STOP_NEUTRINO_SUCCESS })
  } catch (error) {
    dispatch({ type: STOP_NEUTRINO_FAILURE, stopNeutrinoError: error.message })
  }
}

/**
 * currentBlockHeight - Receive current block height.
 *
 * @param {number} height Block height
 * @returns {object} Action
 */
export const currentBlockHeight = height => ({
  type: RECEIVE_CURRENT_BLOCK_HEIGHT,
  blockHeight: height,
})

/**
 * neutrinoBlockHeight - Receive current neutrino sync block height.
 *
 * @param {number} height Block height
 * @returns {object} Action
 */
export const neutrinoBlockHeight = height => ({
  type: RECEIVE_LND_BLOCK_HEIGHT,
  data: { height },
  debounce: SYNC_DEBOUNCE,
})

/**
 * neutrinoBlockHeight - Receive current neutrino sync cfilter height.
 *
 * @param {number} height Block height
 * @returns {object} Action
 */
export const neutrinoCfilterHeight = height => ({
  type: RECEIVE_LND_CFILTER_HEIGHT,
  data: { height },
  debounce: SYNC_DEBOUNCE,
})

/**
 * neutrinoBlockHeight - Receive current neutrino recovery height.
 *
 * @param {number} height Block height
 * @returns {object} Action
 */
export const neutrinoRecoveryHeight = height => ({
  type: RECEIVE_LND_RECOVERY_HEIGHT,
  data: { height },
  debounce: SYNC_DEBOUNCE,
})

/**
 * neutrinoBlockHeight - Receive LND sync status change.
 *
 * @param {string} status Neutrino service sync state.
 * @returns {(dispatch:Function) => Promise<void>} Thunk
 */
export const neutrinoSyncStatus = status => async dispatch => {
  const intl = getIntl()
  switch (status) {
    case 'NEUTRINO_CHAIN_SYNC_PENDING':
      dispatch({ type: SET_SYNC_STATUS_PENDING })
      break
    case 'NEUTRINO_CHAIN_SYNC_WAITING':
      dispatch({ type: SET_SYNC_STATUS_WAITING })
      break
    case 'NEUTRINO_CHAIN_SYNC_IN_PROGRESS':
      dispatch({ type: SET_SYNC_STATUS_IN_PROGRESS })
      break
    case 'NEUTRINO_WALLET_RECOVERY_IN_PROGRESS':
      dispatch({ type: SET_SYNC_STATUS_RECOVERING })
      break
    case 'NEUTRINO_CHAIN_SYNC_COMPLETE':
      dispatch({ type: SET_SYNC_STATUS_COMPLETE })

      // Persist the fact that the wallet has been synced at least once.
      dispatch(setHasSynced(true))
      // HTML 5 desktop notification for sync completion
      showSystemNotification(intl.formatMessage(messages.neutrtino_synced_title), {
        body: intl.formatMessage(messages.neutrtino_synced_body),
      })
      break
    default:
      break
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [START_NEUTRINO]: state => {
    state.isStartingNeutrino = true
    state.startNeutrinoError = null
  },

  [START_NEUTRINO_SUCCESS]: state => {
    state.isStartingNeutrino = false
    state.isNeutrinoRunning = true
    state.startNeutrinoError = null
  },

  [START_NEUTRINO_FAILURE]: (state, { startNeutrinoError }) => {
    state.isStartingNeutrino = false
    state.startNeutrinoError = startNeutrinoError
  },

  [STOP_NEUTRINO]: state => {
    state.isStoppingNeutrino = true
    state.stopNeutrinoError = null
  },
  [STOP_NEUTRINO_SUCCESS]: state => ({
    ...state,
    ...initialState,
  }),
  [STOP_NEUTRINO_FAILURE]: (state, { error }) => ({
    ...state,
    ...initialState,
    stopNeutrinoError: error,
  }),

  [RECEIVE_CURRENT_BLOCK_HEIGHT]: (state, { blockHeight }) => {
    state.blockHeight = blockHeight
  },
  [RECEIVE_LND_BLOCK_HEIGHT]: (state, { data }) => {
    const { first, last } = parseHeightUpdates(data)
    state.neutrinoBlockHeight = last
    state.neutrinoFirstBlockHeight = Math.min(state.neutrinoFirstBlockHeight || first, first)
  },
  [RECEIVE_LND_CFILTER_HEIGHT]: (state, { data }) => {
    const { first, last } = parseHeightUpdates(data)
    state.neutrinoCfilterHeight = last
    state.neutrinoFirstCfilterHeight = Math.min(state.neutrinoFirstCfilterHeight || first, first)
  },
  [RECEIVE_LND_RECOVERY_HEIGHT]: (state, { data }) => {
    const { first, last } = parseHeightUpdates(data)
    state.neutrinoRecoveryHeight = last
    state.neutrinoFirstRecoveryHeight = Math.min(state.neutrinoFirstRecoveryHeight || first, first)
  },

  [SET_SYNC_STATUS_PENDING]: state => {
    state.syncStatus = 'pending'
  },
  [SET_SYNC_STATUS_WAITING]: state => {
    state.syncStatus = 'waiting'
  },
  [SET_SYNC_STATUS_IN_PROGRESS]: state => {
    state.syncStatus = 'in-progress'
  },
  [SET_SYNC_STATUS_COMPLETE]: state => {
    state.syncStatus = 'complete'
  },
  [SET_SYNC_STATUS_RECOVERING]: state => {
    state.syncStatus = 'recovering'
  },

  [SET_GRPC_ACTIVE_INTERFACE]: (state, { grpcActiveInterface }) => {
    state.grpcActiveInterface = grpcActiveInterface
  },

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
const neutrinoRecoveryHeightSelector = state => state.neutrino.neutrinoRecoveryHeight
const neutrinoFirstRecoveryHeightSelector = state => state.neutrino.neutrinoFirstRecoveryHeight
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
neutrinoSelectors.neutrinoRecoveryHeight = neutrinoRecoveryHeightSelector

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

    return Number.isFinite(percentage) ? percentage : undefined
  }
)

neutrinoSelectors.neutrinoRecoveryPercentage = createSelector(
  blockHeightSelector,
  neutrinoRecoveryHeightSelector,
  neutrinoFirstRecoveryHeightSelector,
  (blockHeight, neutrinoRecoveryHeight, neutrinoFirstRecoveryHeight) => {
    const filtersToSync = blockHeight - neutrinoFirstRecoveryHeight
    const filtersRemaining = blockHeight - neutrinoRecoveryHeight
    const filtersDone = filtersToSync - filtersRemaining

    const percentage = Math.floor((filtersDone / filtersToSync) * 100)

    return Number.isFinite(percentage) ? percentage : undefined
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

export default createReducer(initialState, ACTION_HANDLERS)
