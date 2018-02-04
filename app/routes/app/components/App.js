import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GlobalError from 'components/GlobalError'
import LoadingBolt from 'components/LoadingBolt'
import Form from 'components/Form'
import ModalRoot from 'components/ModalRoot'
import Network from 'components/Contacts/Network'
import styles from './App.scss'

class App extends Component {
  componentWillMount() {
    const { fetchTicker, fetchInfo, newAddress, fetchChannels, fetchBalance } = this.props

    fetchTicker()
    fetchInfo()
    newAddress('np2wkh')
    fetchChannels()
    fetchBalance()
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

      children
    } = this.props

    if (!currentTicker) { return <LoadingBolt /> }

    return (
      <div style={{ height: '100%' }}>
        <div className={styles.titleBar} />
        <GlobalError error={error} clearError={clearError} />
        <ModalRoot
          modalType={modalType}
          modalProps={modalProps}
          hideModal={hideModal}
          currentTicker={currentTicker}
          currency={ticker.currency}
        />

        <Form formType={form.formType} formProps={formProps} closeForm={closeForm} />

        <div className={styles.content}>
          {children}
        </div>
        <Network
          channels={channels}
          balance={balance}
          currentTicker={currentTicker}
        />
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
