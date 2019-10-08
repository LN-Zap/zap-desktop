import { send } from 'redux-electron-ipc'
/**
 * waitForIpcEvent - Sends a message to main process and waits for the reply.
 * WARNING: only one event of each kind must be active at a time. All concurrent requests except for one
 * will timeout and it's not determined which one of them go through.
 *
 * @param {string} message ipc message name
 * @param {object} params ipc event params
 * @param {string} responseEvent ipc success response event. defaults to `${message}Success`
 * @param {string} failureEvent ipc failure response event. defaults to `${message}Failure`
 * @returns {Promise} promise that fulfills on success/failure response from ipc main or
 * timeouts after `timeout` milliseconds
 */
export default function waitForIpcEvent(message, params, responseEvent, failureEvent) {
  return dispatch => {
    const failureEventName = failureEvent || `${message}Failure`
    const successEventName = responseEvent || `${message}Success`

    return new Promise((resolve, reject) => {
      dispatch(send(message, params))

      const onSuccess = (event, response) => {
        removeFailureEventListener()
        resolve(response)
      }
      const onFailure = (event, response) => {
        removeSuccessEventListener()
        reject(response)
      }

      const removeFailureEventListener = () => window.ipcRenderer.off(successEventName, onSuccess)
      const removeSuccessEventListener = () => window.ipcRenderer.off(failureEventName, onFailure)

      window.ipcRenderer.once(failureEventName, onFailure).once(successEventName, onSuccess)
    })
  }
}
