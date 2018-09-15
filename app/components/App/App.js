import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GlobalError from 'components/GlobalError'
import LoadingBolt from 'components/LoadingBolt'

import Form from 'components/Form'
import ChannelForm from 'components/Contacts/ChannelForm'

import Network from 'components/Contacts/Network'
import AddChannel from 'components/Contacts/AddChannel'
import ReceiveModal from 'components/Wallet/ReceiveModal'
import ActivityModal from 'components/Activity/ActivityModal'

import styles from './App.scss'

class App extends Component {
  componentWillMount() {
    const {
      fetchTicker,
      fetchInfo,
      fetchChannels,
      fetchSuggestedNodes,
      fetchBalance,
      fetchDescribeNetwork
    } = this.props

    // fetch price ticker
    fetchTicker()
    // fetch node info
    fetchInfo()
    // fetch nodes channels
    fetchChannels()
    // fetch suggested nodes list from zap.jackmallers.com/suggested-peers
    fetchSuggestedNodes()
    // fetch nodes balance
    fetchBalance()
    // fetch LN network from nides POV
    fetchDescribeNetwork()
  }

  render() {
    const {
      currentTicker,
      form,

      formProps,
      closeForm,

      error: { error },
      clearError,

      contactsFormProps,
      networkTabProps,
      receiveModalProps,
      activityModalProps,
      channelFormProps,

      children
    } = this.props

    if (!currentTicker) {
      return <LoadingBolt />
    }

    return (
      <div>
        <div className={styles.titleBar} />
        <GlobalError error={error} clearError={clearError} />

        <ChannelForm {...channelFormProps} />

        <ReceiveModal {...receiveModalProps} />
        <ActivityModal {...activityModalProps} />

        <div className={styles.content}>{children}</div>

        {contactsFormProps.contactsform.isOpen ? (
          <AddChannel {...contactsFormProps} />
        ) : (
          <Network {...networkTabProps} />
        )}

        <Form formType={form.formType} formProps={formProps} closeForm={closeForm} />
      </div>
    )
  }
}

App.propTypes = {
  form: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  closeForm: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  currentTicker: PropTypes.object,
  contactsFormProps: PropTypes.object,
  networkTabProps: PropTypes.object,
  activityModalProps: PropTypes.object,
  receiveModalProps: PropTypes.object,
  channelFormProps: PropTypes.object,

  fetchInfo: PropTypes.func.isRequired,
  fetchTicker: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,
  fetchDescribeNetwork: PropTypes.func.isRequired,
  fetchSuggestedNodes: PropTypes.func.isRequired,

  children: PropTypes.object.isRequired
}

export default App
