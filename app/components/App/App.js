import React from 'react'
import PropTypes from 'prop-types'

import Form from 'components/Form'
import ChannelForm from 'components/Contacts/ChannelForm'
import Network from 'components/Contacts/Network'
import AddChannel from 'components/Contacts/AddChannel'
import ReceiveModal from 'components/Wallet/ReceiveModal'
import { ActivityModalContainer } from 'containers/Activity/ActivityModalContainer'

import Activity from 'containers/Activity'
import { MainContent, Sidebar } from 'components/UI'

// Initial refetch after 2 seconds.
const INITIAL_REFETCH_INTERVAL = 2000

// Fetch node data no less than once every 10 minutes.
const MAX_REFETCH_INTERVAL = 1000 * 60 * 10

// Amount to increment refetch timer by after each fetch.
const BACKOFF_SCHEDULE = 1.5

class App extends React.Component {
  timer = undefined
  nextFetchIn = INITIAL_REFETCH_INTERVAL

  static propTypes = {
    form: PropTypes.object.isRequired,
    formProps: PropTypes.object.isRequired,
    closeForm: PropTypes.func.isRequired,
    currentTicker: PropTypes.object,
    contactsFormProps: PropTypes.object,
    networkTabProps: PropTypes.object,
    receiveModalProps: PropTypes.object,
    channelFormProps: PropTypes.object,
    setIsWalletOpen: PropTypes.func.isRequired,
    fetchPeers: PropTypes.func.isRequired,
    fetchDescribeNetwork: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { setIsWalletOpen } = this.props

    // Set wallet open state.
    setIsWalletOpen(true)

    // fetch node info.
    this.fetchData()
  }

  componentWillUnmount() {
    this.clearFetchTimer()
  }

  /**
   * Fetch node data on an exponentially incrementing backoff schedule so that when the app is first mounted, we fetch
   * node data quite frequently but as time goes on the frequency is reduced down to a maximum of MAX_REFETCH_INTERVAL
   */
  fetchData = () => {
    const { fetchPeers, fetchDescribeNetwork } = this.props
    const { nextFetchIn } = this
    const next = Math.round(Math.min(nextFetchIn * BACKOFF_SCHEDULE, MAX_REFETCH_INTERVAL))

    // Fetch information about connected peers.
    fetchPeers()

    // fetch LN network from nodes POV.
    fetchDescribeNetwork()

    // ensure previous timer is cleared if it exists
    this.clearFetchTimer()

    this.timer = setTimeout(this.fetchData, nextFetchIn)
    // Increment the next fetch interval.
    this.nextFetchIn = next
  }

  clearFetchTimer() {
    const { timer } = this
    if (typeof timer !== 'undefined') {
      clearTimeout(timer)
    }
  }

  render() {
    const {
      currentTicker,
      form,
      formProps,
      closeForm,
      contactsFormProps,
      networkTabProps,
      receiveModalProps,
      channelFormProps
    } = this.props

    return (
      <>
        {currentTicker && (
          <>
            <ChannelForm {...channelFormProps} />
            <ReceiveModal {...receiveModalProps} />
            <ActivityModalContainer />
            <Form formType={form.formType} formProps={formProps} closeForm={closeForm} />
          </>
        )}

        <MainContent>
          <Activity />
        </MainContent>

        <Sidebar.medium>
          {contactsFormProps.contactsform.isOpen ? (
            <AddChannel {...contactsFormProps} />
          ) : (
            <Network {...networkTabProps} />
          )}
        </Sidebar.medium>
      </>
    )
  }
}

export default App
