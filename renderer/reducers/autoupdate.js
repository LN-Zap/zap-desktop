import { send } from 'redux-electron-ipc'

// ------------------------------------
// Constants
// ------------------------------------

export const CONFIGURE_AUTOUPDATER = 'CONFIGURE_AUTOUPDATER'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * configureAutoUpdater - Tell the main process to reconfigure the autoupdater.
 *
 * @param {{ active }} settings AutoUpdater settings
 *
 * @returns {Function} Thunk
 */
export const configureAutoUpdater = settings => dispatch => {
  dispatch({ type: CONFIGURE_AUTOUPDATER, settings })
  dispatch(send('configureAutoUpdater', settings))
}
