import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GlobalError from 'components/GlobalError'
import LoadingBolt from 'components/LoadingBolt'
import Form from 'components/Form'
import ModalRoot from 'components/ModalRoot'
import Network from 'components/Contacts/Network'
import ContactModal from 'components/Contacts/ContactModal'
import ContactsForm from 'components/Contacts/ContactsForm'
import styles from './App.scss'

class App extends Component {
  componentWillMount() {
    const { fetchTicker, fetchInfo, newAddress, fetchChannels, fetchBalance, fetchDescribeNetwork } = this.props

    fetchTicker()
    fetchInfo()
    newAddress('np2wkh')
    fetchChannels()
    fetchBalance()
    fetchDescribeNetwork()
  }

  render() {
    const {
      modal: { modalType, modalProps },
      hideModal,
      ticker,
      currentTicker,
      form,

      channels,
      balance,

      formProps,
      closeForm,

      error: { error },
      clearError,

      contactModalProps,
      contactsFormProps,
      networkTabProps,

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
        />

        <ContactModal {...contactModalProps} />
        <ContactsForm {...contactsFormProps} />

        <Form formType={form.formType} formProps={formProps} closeForm={closeForm} />

        <div className={styles.content}>
          {children}
        </div>
        
        <Network {...networkTabProps} />
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

  newAddress: PropTypes.func.isRequired,
  fetchInfo: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchTicker: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,

  currentTicker: PropTypes.object,


  children: PropTypes.object.isRequired
}

export default App
