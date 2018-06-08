import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GlobalError from 'components/GlobalError'
import LoadingBolt from 'components/LoadingBolt'

import Form from 'components/Form'
import ChannelForm from 'components/Contacts/ChannelForm'
import ModalRoot from 'components/ModalRoot'

import Network from 'components/Contacts/Network'
import AddChannel from 'components/Contacts/AddChannel'
import ContactModal from 'components/Contacts/ContactModal'

import ReceiveModal from 'components/Wallet/ReceiveModal'
import ActivityModal from 'components/Activity/ActivityModal'

import styles from './App.scss'

class App extends Component {
  componentWillMount() {
    const {
      fetchTicker,
      fetchInfo,
      newAddress,
      fetchChannels,
      fetchSuggestedNodes,
      fetchBalance,
      fetchDescribeNetwork
    } = this.props

    // fetch price ticker
    fetchTicker()
    // fetch node info
    fetchInfo()
    // fetch new address for wallet
    newAddress('np2wkh')
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
      modal: { modalType, modalProps },
      hideModal,
      ticker,
      currentTicker,
      form,
      info: { data },

      formProps,
      closeForm,

      error: { error },
      clearError,

      contactModalProps,
      contactsFormProps,
      networkTabProps,
      receiveModalProps,
      activityModalProps,
      channelFormProps,

      children
    } = this.props

    if (!currentTicker) { return <LoadingBolt /> }

    return (
      <div>
        <div className={styles.titleBar} />
        <GlobalError error={error} clearError={clearError} />
        <ModalRoot
          modalType={modalType}
          modalProps={modalProps}
          hideModal={hideModal}
          currentTicker={currentTicker}
          currency={ticker.currency}
          isTestnet={data.testnet}
        />

        <ContactModal {...contactModalProps} />

        <ChannelForm {...channelFormProps} />

        <ReceiveModal {...receiveModalProps} />
        <ActivityModal {...activityModalProps} />

        <div className={styles.content}>
          {children}
        </div>

        {
          contactsFormProps.contactsform.isOpen ?
            <AddChannel {...contactsFormProps} />
            :
            <Network {...networkTabProps} />
        }

        <Form formType={form.formType} formProps={formProps} closeForm={closeForm} />
      </div>
    )
  }
}

App.propTypes = {
  modal: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  closeForm: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  currentTicker: PropTypes.object,
  contactModalProps: PropTypes.object,
  contactsFormProps: PropTypes.object,
  networkTabProps: PropTypes.object,
  activityModalProps: PropTypes.object,
  receiveModalProps: PropTypes.object,
  channelFormProps: PropTypes.object,

  newAddress: PropTypes.func.isRequired,
  fetchInfo: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchTicker: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  fetchChannels: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,
  fetchDescribeNetwork: PropTypes.func.isRequired,
  fetchSuggestedNodes: PropTypes.func.isRequired,

  children: PropTypes.object.isRequired
}

export default App
