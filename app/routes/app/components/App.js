// @flow
import React, { Component } from 'react'
import Websocket from 'react-websocket'
import Form from './components/Form'
import Nav from './components/Nav.js'
import styles from './App.scss'

class App extends Component {
  componentWillMount() {
    const { fetchTicker, fetchBalance } = this.props
    
    fetchTicker()
    fetchBalance()
  }

  render() {
    const {
      ticker,
      balance,
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
      children
    } = this.props
    
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
        />
        <Nav 
          ticker={ticker}
          balance={balance}
          setCurrency={setCurrency}
          formClicked={(formType) => setForm({ modalOpen: true, formType })} 
        />
        <div className={styles.content}>
          {children}
        </div>
        
        <Websocket
          debug
          url='ws://localhost:3000/'
          onMessage={(data) => console.log('data: ', data)}
        />
      </div>
    )
  }
}

App.propTypes = {
  ticker: React.PropTypes.object,
  children: React.PropTypes.object
}

export default App