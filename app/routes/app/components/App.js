import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
      ticker,
      balance,
      invoice: { formInvoice },
      form,
      setAmount,
      setMessage,
      setPubkey,
      setPaymentRequest,
      payment,
      peers,
      setCurrency,
      setForm,
      createInvoice,
      payInvoice,
      fetchInvoice,
      currentTicker,
      children
    } = this.props

    if (!currentTicker) { return <div>Loading...</div> }

    return (
      <div>
        <Form
          isOpen={form.modalOpen}
          close={() => setForm({ modalOpen: false })}
          setAmount={setAmount}
          setMessage={setMessage}
          setPubkey={setPubkey}
          setPaymentRequest={setPaymentRequest}
          payment={payment}
          peers={peers}
          ticker={ticker}
          form={form}
          createInvoice={createInvoice}
          payInvoice={payInvoice}
          fetchInvoice={fetchInvoice}
          formInvoice={formInvoice}
          currentTicker={currentTicker}
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
  fetchTicker: PropTypes.func.isRequired,
  fetchBalance: PropTypes.func.isRequired,
  ticker: PropTypes.object.isRequired,
  balance: PropTypes.object.isRequired,
  invoice: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setAmount: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setPubkey: PropTypes.func.isRequired,
  setPaymentRequest: PropTypes.func.isRequired,
  payment: PropTypes.object.isRequired,
  peers: PropTypes.array,
  setCurrency: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
  createInvoice: PropTypes.func.isRequired,
  payInvoice: PropTypes.func.isRequired,
  fetchInvoice: PropTypes.func.isRequired,
  fetchInfo: PropTypes.func.isRequired,
  currentTicker: PropTypes.object,
  children: PropTypes.object.isRequired
}

export default App
