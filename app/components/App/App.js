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
    const { fetchTicker, fetchInfo, fetchSuggestedNodes, fetchDescribeNetwork } = this.props

    // fetch price ticker
    fetchTicker()
    // fetch node info
    fetchInfo()
    // fetch suggested nodes list from zap.jackmallers.com/suggested-peers
    fetchSuggestedNodes()
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

      settings,

      children
    } = this.props

    if (!currentTicker) {
      return <LoadingBolt theme={settings.theme} />
    }

    return (
      <div className={`${settings.theme}`}>
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
  fetchDescribeNetwork: PropTypes.func.isRequired,
  fetchSuggestedNodes: PropTypes.func.isRequired,

  children: PropTypes.object.isRequired
}

export default App
