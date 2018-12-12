import React from 'react'
import PropTypes from 'prop-types'

import Form from 'components/Form'
import ChannelForm from 'components/Contacts/ChannelForm'
import Network from 'components/Contacts/Network'
import AddChannel from 'components/Contacts/AddChannel'
import ReceiveModal from 'components/Wallet/ReceiveModal'
import ActivityModal from 'components/Activity/ActivityModal'

import Activity from 'containers/Activity'
import { MainContent, Sidebar } from 'components/UI'

// Initial refetch after 2 seconds.
const INITIAL_REFETCH_INTERVAL = 2000

// Fetch node data no less than once every 10 minutes.
const MAX_REFETCH_INTERVAL = 1000 * 60 * 10

// Amount to increment refetch timer by after each fetch.
const BACKOFF_SCHEDULE = 1.5

class App extends React.Component {
  state = {
    timer: null,
    nextFetchIn: INITIAL_REFETCH_INTERVAL
  }

  static propTypes = {
    form: PropTypes.object.isRequired,
    formProps: PropTypes.object.isRequired,
    closeForm: PropTypes.func.isRequired,
    currentTheme: PropTypes.string.isRequired,
    currentTicker: PropTypes.object,
    contactsFormProps: PropTypes.object,
    networkTabProps: PropTypes.object,
    activityModalProps: PropTypes.object,
    receiveModalProps: PropTypes.object,
    channelFormProps: PropTypes.object,
    setIsWalletOpen: PropTypes.func.isRequired,
    fetchInfo: PropTypes.func.isRequired,
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
    const { timer } = this.state
    clearTimeout(timer)
  }

  /**
   * Fetch node data on an expontially incrementing backoff schedule so that when the app is first mounted, we fetch
   * node data quite frequently but as time goes on the frequency is reduced down to a maximum of MAX_REFETCH_INTERVAL
   */
  fetchData = () => {
    const { nextFetchIn } = this.state
    const next = Math.round(Math.min(nextFetchIn * BACKOFF_SCHEDULE, MAX_REFETCH_INTERVAL))

    // Fetch data.
    this.initNode()

    // Schedule next fetch.
    const timer = setTimeout(this.fetchData, nextFetchIn)

    // Increment the next fetch interval.
    this.setState({ timer, nextFetchIn: next })
  }

  initNode = () => {
    const { fetchInfo, fetchDescribeNetwork, fetchPeers } = this.props
    // fetch node info.
    fetchInfo()
    // fetch LN network from nodes POV.
    fetchDescribeNetwork()
    // Fetch information about connected peers.
    fetchPeers()
  }

  render() {
    const {
      currentTheme,
      currentTicker,
      form,
      formProps,
      closeForm,
      contactsFormProps,
      networkTabProps,
      receiveModalProps,
      activityModalProps,
      channelFormProps
    } = this.props

    if (!currentTicker) {
      return null
    }

    return (
      <>
        <ChannelForm {...channelFormProps} />
        <ReceiveModal {...receiveModalProps} />
        <ActivityModal {...activityModalProps} />
        <Form formType={form.formType} formProps={formProps} closeForm={closeForm} />
        <MainContent className={`${currentTheme}`}>
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
