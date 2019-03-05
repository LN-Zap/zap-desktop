import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Activity from 'containers/Activity'
import Wallet from 'containers/Wallet'
import { MainContent } from 'components/UI'
import { useInterval } from 'hooks'

// Initial re-fetch after 2 seconds.
const INITIAL_REFETCH_INTERVAL = 2000

// Fetch node data no less than once every 10 minutes.
const MAX_REFETCH_INTERVAL = 1000 * 60 * 10

// Amount to increment re-fetch timer by after each fetch.
const BACKOFF_SCHEDULE = 1.5

function App({ fetchActivityHistory, setIsWalletOpen, fetchPeers }) {
  const [nextFetchIn, setNextFetchIn] = useState(INITIAL_REFETCH_INTERVAL)
  /**
   * Fetch node data on an exponentially incrementing backoff schedule so that when the app is first mounted, we fetch
   * node data quite frequently but as time goes on the frequency is reduced down to a maximum of MAX_REFETCH_INTERVAL
   */
  const fetchData = () => {
    setNextFetchIn(Math.round(Math.min(nextFetchIn * BACKOFF_SCHEDULE, MAX_REFETCH_INTERVAL)))
    // Fetch information about connected peers.
    fetchPeers()
  }

  useEffect(() => {
    // Set wallet open state.
    setIsWalletOpen(true)
    // fetch data from lnd.
    fetchActivityHistory()
    // fetch node info.
    fetchPeers()
  }, [])

  useInterval(fetchData, nextFetchIn)

  return (
    <MainContent>
      <Wallet />
      <Activity />
    </MainContent>
  )
}

App.propTypes = {
  setIsWalletOpen: PropTypes.func.isRequired,
  fetchPeers: PropTypes.func.isRequired,
  fetchActivityHistory: PropTypes.func.isRequired
}

export default App
