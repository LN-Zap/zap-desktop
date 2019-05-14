import { send } from 'redux-electron-ipc'

// ------------------------------------
// Constants
// ------------------------------------

export const CONFIGURE_AUTOUPDATER = 'CONFIGURE_AUTOUPDATER'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * Tell the main process to reconfigure the autoupdater.
 */
export const configureAutoUpdater = settings => dispatch => {
  dispatch({ type: CONFIGURE_AUTOUPDATER, settings })
  dispatch(send('configureAutoUpdater', settings))
}
