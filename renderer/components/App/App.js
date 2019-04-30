import React, { useEffect } from 'react'
import createScheduler from '@zap/utils/scheduler'
import PropTypes from 'prop-types'
import Activity from 'containers/Activity'
import Wallet from 'containers/Wallet'
import { MainContent } from 'components/UI'

// Bitcoin blocks come on average every 10 mins
// but we poll a lot more frequently to make UI a little bit more responsive
const TX_REFETCH_INTERVAL = 1000 * 60 * 1

// Initial re-fetch after 2 seconds.
const INITIAL_REFETCH_INTERVAL = 2000

// Fetch node data no less than once every 10 minutes.
const MAX_REFETCH_INTERVAL = 1000 * 60 * 10

// Amount to increment re-fetch timer by after each fetch.
const BACKOFF_SCHEDULE = 1.5

// App scheduler / polling service
const appScheduler = createScheduler()

function App({
  isAppReady,
  modals,
  payReq,
  fetchActivityHistory,
  setIsWalletOpen,
  fetchPeers,
  fetchTransactions,
  setModals,
}) {
  /**
   * App scheduler / polling service setup. Add new app-wide polls here
   */
  useEffect(() => {
    /**
     * Fetch node data on an exponentially incrementing backoff schedule so that when the app is first mounted, we fetch
     * node data quite frequently but as time goes on the frequency is reduced down to a maximum of MAX_REFETCH_INTERVAL
     */
    appScheduler.addTask({
      task: fetchPeers,
      taskId: 'fetchPeers',
      baseDelay: INITIAL_REFETCH_INTERVAL,
      maxDelay: MAX_REFETCH_INTERVAL,
      backoff: BACKOFF_SCHEDULE,
    })

    appScheduler.addTask({
      task: fetchTransactions,
      taskId: 'fetchTransactions',
      baseDelay: TX_REFETCH_INTERVAL,
    })

    return () => {
      appScheduler.removeAllTasks()
    }
  }, [fetchPeers, fetchTransactions])

  useEffect(() => {
    // Set wallet open state.
    setIsWalletOpen(true)
    // fetch data from lnd.
    fetchActivityHistory()
    // fetch node info.
    fetchPeers()
  }, [fetchActivityHistory, fetchPeers, setIsWalletOpen])

  // Open the pay form when a payment link is used.
  useEffect(() => {
    if (isAppReady && payReq) {
      if (!modals.find(m => m.type === 'PAY_FORM')) {
        setModals([{ type: 'PAY_FORM' }])
      }
    }
  }, [payReq, isAppReady, modals, setModals])

  if (!isAppReady) {
    return null
  }

  return (
    <MainContent>
      <Wallet />
      <Activity />
    </MainContent>
  )
}

App.propTypes = {
  fetchActivityHistory: PropTypes.func.isRequired,
  fetchPeers: PropTypes.func.isRequired,
  fetchTransactions: PropTypes.func.isRequired,
  isAppReady: PropTypes.bool.isRequired,
  modals: PropTypes.array.isRequired,
  payReq: PropTypes.object,
  setIsWalletOpen: PropTypes.func.isRequired,
  setModals: PropTypes.func.isRequired,
}

export default App
