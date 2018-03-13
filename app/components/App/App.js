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

class App extends React.Component {
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
    const { fetchInfo, fetchDescribeNetwork, fetchPeers, setIsWalletOpen } = this.props

    // Set wallet open state.
    setIsWalletOpen(true)

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
