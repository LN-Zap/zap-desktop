import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalRoot from './components/ModalRoot'
import Form from './components/Form'
import Nav from './components/Nav'
import styles from './App.scss'

class App extends Component {
  componentWillMount() {
    const { fetchTicker, fetchBalance, fetchInfo } = this.props

    fetchTicker()
    fetchBalance()
    fetchInfo()
  }

  render() {
    const {
      modal: { modalType, modalProps },
      hideModal,
      ticker,
      balance,
      invoice: { formInvoice },
      form,
      setAmount,
      setOnchainAmount,
      setMessage,
      setPubkey,
      setPaymentRequest,
      transaction: { sendingTransaction },
      peers,
      setCurrency,
      setForm,
      createInvoice,
      payInvoice,
      sendCoins,
      fetchInvoice,
      currentTicker,
      isOnchain,
      isLn,
      children
    } = this.props

    if (!currentTicker) { return <div>Loading...</div> }

    return (
      <div>
        <ModalRoot
          modalType={modalType}
          modalProps={modalProps}
          hideModal={hideModal}
          currentTicker={currentTicker}
          currency={ticker.currency}
        />
        <Form
          isOpen={form.modalOpen}
          close={() => setForm({ modalOpen: false })}
          setAmount={setAmount}
          setOnchainAmount={setOnchainAmount}
          setMessage={setMessage}
          setPubkey={setPubkey}
          setPaymentRequest={setPaymentRequest}
          peers={peers}
          ticker={ticker}
          form={form}
          sendingTransaction={sendingTransaction}
          createInvoice={createInvoice}
          payInvoice={payInvoice}
          sendCoins={sendCoins}
          fetchInvoice={fetchInvoice}
          formInvoice={formInvoice}
          currentTicker={currentTicker}
          isOnchain={isOnchain}
          isLn={isLn}
        />
        <Nav
          ticker={ticker}
          balance={balance}
          setCurrency={setCurrency}
          formClicked={formType => setForm({ modalOpen: true, formType })}
          currentTicker={currentTicker}
        />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  modal: PropTypes.object.isRequired,
  hideModal: PropTypes.func.isRequired,
  fetchTicker: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,
  ticker: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setAmount: PropTypes.func.isRequired,
  setOnchainAmount: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setPubkey: PropTypes.func.isRequired,
  setPaymentRequest: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
  peers: PropTypes.array,
  setCurrency: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
  createInvoice: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  sendCoins: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  fetchInfo: PropTypes.func.isRequired,
  currentTicker: PropTypes.object,
  isOnchain: PropTypes.bool.isRequired,
  isLn: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired
}

export default App
