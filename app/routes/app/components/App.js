// @flow
import React, { Component } from 'react'
import Form from './components/Form'
import Nav from './components/Nav.js'
import Socket from './components/Socket.js'
import styles from './App.scss'

export const CHANNEL_DATA = 'CHANNEL_DATA'
export const CHANNEL_END = 'CHANNEL_END'
export const CHANNEL_ERROR = 'CHANNEL_ERROR'
export const CHANNEL_STATUS = 'CHANNEL_STATUS'

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
      fetchChannels,
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
        
        <Socket fetchChannels={fetchChannels} />
      </div>
    )
  }
}

App.propTypes = {
  ticker: React.PropTypes.object,
  children: React.PropTypes.object
}

export default App