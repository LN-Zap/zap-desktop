import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import createScheduler from '@zap/utils/scheduler'
import Activity from 'containers/Activity'
import LnurlAuthPrompt from 'containers/Lnurl/LnurlAuthPrompt'
import LnurlChannelPrompt from 'containers/Lnurl/LnurlChannelPrompt'
import LnurlWithdrawPrompt from 'containers/Lnurl/LnurlWithdrawPrompt'
import Wallet from 'containers/Wallet'

// Bitcoin blocks come on average every 10 mins
// but we poll a lot more frequently to make UI a little bit more responsive
const TX_REFETCH_INTERVAL = 1000 * 60 * 1

// Refresh autopilot scores every hour.
const AUTOPILOT_SCORES_REFRESH_INTERVAL = 1000 * 60 * 60

// Initial re-fetch after 30 seconds.
const PEERS_INITIAL_REFETCH_INTERVAL = 1000 * 30

// Fetch peers list data no less than once every 10 minutes.
const PEERS_MAX_REFETCH_INTERVAL = 1000 * 60 * 10

// Amount to increment re-fetch timer by after each fetch.
const PEERS_REFETCH_BACKOFF_SCHEDULE = 2

// App scheduler / polling service
const appScheduler = createScheduler()

const App = ({
  activeWalletSettings,
  isAppReady,
  modals,
  redirectPayReq,
  updateAutopilotNodeScores,
  initActivityHistory,
  setIsWalletOpen,
  fetchDescribeNetwork,
  fetchPeers,
  fetchTransactions,
  setModals,
  initBackupService,
  isSyncedToGraph,
  fetchSuggestedNodes,
  initTickers,
  lnurlAuthParams,
  lnurlChannelParams,
  lnurlWithdrawParams,
  finishLnurlAuth,
  finishLnurlWithdraw,
  finishLnurlChannel,
  willShowLnurlAuthPrompt,
  willShowLnurlChannelPrompt,
  willShowLnurlWithdrawPrompt,
}) => {
  /**
   * General app initialization.
   */
  useEffect(() => {
    if (activeWalletSettings.type === 'local') {
      appScheduler.addTask({
        task: updateAutopilotNodeScores,
        taskId: 'updateAutopilotNodeScores',
        baseDelay: AUTOPILOT_SCORES_REFRESH_INTERVAL,
      })
      appScheduler.addTask({
        task: () => fetchTransactions(true),
        taskId: 'fetchTransactions',
        baseDelay: TX_REFETCH_INTERVAL,
      })
    }

    // Set wallet open state.
    setIsWalletOpen(true)
    // fetch data from lnd.
    updateAutopilotNodeScores()
    initActivityHistory()
    fetchPeers()
    fetchDescribeNetwork()
    // fetch other application data.
    fetchSuggestedNodes()
    initTickers()
    // initialize backup service in forceUseTokens mode to avoid
    // launching it for wallets that don't have backup setup
    initBackupService()

    return () => {
      appScheduler.removeAllTasks()
    }
  }, [
    activeWalletSettings,
    initActivityHistory,
    fetchDescribeNetwork,
    fetchPeers,
    fetchSuggestedNodes,
    fetchTransactions,
    initBackupService,
    initTickers,
    setIsWalletOpen,
    updateAutopilotNodeScores,
  ])

  /**
   * Fetch node data on an exponentially incrementing backoff schedule so that when the app is first mounted, we fetch
   * node data quite frequently but as time goes on the frequency is reduced to a max of PEERS_MAX_REFETCH_INTERVAL
   */
  useEffect(() => {
    if (isSyncedToGraph) {
      appScheduler.removeTask('fetchNetworkData')
    } else {
      appScheduler.addTask({
        task: () => fetchDescribeNetwork(),
        taskId: 'fetchNetworkData',
        baseDelay: PEERS_INITIAL_REFETCH_INTERVAL,
        maxDelay: PEERS_MAX_REFETCH_INTERVAL,
        backoff: PEERS_REFETCH_BACKOFF_SCHEDULE,
      })
    }
  }, [isSyncedToGraph, fetchDescribeNetwork])

  /**
   * Lnurl handlers.
   */
  useEffect(() => {
    if (lnurlAuthParams && !willShowLnurlAuthPrompt) {
      finishLnurlAuth()
    }
    if (lnurlChannelParams && !willShowLnurlChannelPrompt) {
      finishLnurlChannel()
    }
    if (lnurlWithdrawParams && !willShowLnurlWithdrawPrompt) {
      finishLnurlWithdraw()
    }
  }, [
    finishLnurlAuth,
    finishLnurlChannel,
    finishLnurlWithdraw,
    lnurlAuthParams,
    lnurlChannelParams,
    lnurlWithdrawParams,
    willShowLnurlAuthPrompt,
    willShowLnurlChannelPrompt,
    willShowLnurlWithdrawPrompt,
  ])

  // Open the pay form when a payment link is used.
  useEffect(() => {
    if (isAppReady && redirectPayReq) {
      if (!modals.find(m => m.type === 'PAY_FORM')) {
        setModals([{ type: 'PAY_FORM' }])
      }
    }
  }, [redirectPayReq, isAppReady, modals, setModals])

  if (!isAppReady) {
    return null
  }

  return (
    <Flex as="article" flexDirection="column" width={1}>
      <Wallet />
      <Activity />
      {willShowLnurlAuthPrompt && <LnurlAuthPrompt />}
      {willShowLnurlChannelPrompt && <LnurlChannelPrompt />}
      {willShowLnurlWithdrawPrompt && <LnurlWithdrawPrompt />}
    </Flex>
  )
}

App.propTypes = {
  activeWalletSettings: PropTypes.object,
  fetchDescribeNetwork: PropTypes.func.isRequired,
  fetchPeers: PropTypes.func.isRequired,
  fetchSuggestedNodes: PropTypes.func.isRequired,
  fetchTransactions: PropTypes.func.isRequired,
  finishLnurlAuth: PropTypes.func.isRequired,
  finishLnurlChannel: PropTypes.func.isRequired,
  finishLnurlWithdraw: PropTypes.func.isRequired,
  initActivityHistory: PropTypes.func.isRequired,
  initBackupService: PropTypes.func.isRequired,
  initTickers: PropTypes.func.isRequired,
  isAppReady: PropTypes.bool.isRequired,
  isSyncedToGraph: PropTypes.bool.isRequired,
  lnurlAuthParams: PropTypes.object,
  lnurlChannelParams: PropTypes.object,
  lnurlWithdrawParams: PropTypes.object,
  modals: PropTypes.array.isRequired,
  redirectPayReq: PropTypes.object,
  setIsWalletOpen: PropTypes.func.isRequired,
  setModals: PropTypes.func.isRequired,
  updateAutopilotNodeScores: PropTypes.func.isRequired,
  willShowLnurlAuthPrompt: PropTypes.bool,
  willShowLnurlChannelPrompt: PropTypes.bool,
  willShowLnurlWithdrawPrompt: PropTypes.bool,
}

export default App
