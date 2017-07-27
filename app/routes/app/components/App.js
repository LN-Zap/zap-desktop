// @flow
import React, { Component } from 'react'
import Form from './components/Form.js'
import Nav from './components/Nav.js'
import styles from './App.scss'

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      form: false
    }
  }

  componentWillMount() {
    const { fetchTicker, fetchBalance } = this.props
    
    fetchTicker()
    fetchBalance()
  }

  render() {
    const {
      ticker,
      balance,
      setAmount,
      setMessage,
      setPubkey,
      payment,
      peers,
      fetchPeers,
      setCurrency,
      children
    } = this.props

    return (
      <div>
        <Form
          isOpen={this.state.form}
          close={() => this.setState({ form: false })}
          setAmount={setAmount}
          setMessage={setMessage}
          setPubkey={setPubkey}
          payment={payment}
          fetchPeers={fetchPeers}
          peers={peers}
          ticker={ticker}
        />
        <Nav 
          ticker={ticker}
          balance={balance}
          setCurrency={setCurrency}
          formClicked={(type) => this.setState({ form: true })} 
        />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  ticker: React.PropTypes.object,
  children: React.PropTypes.object
}

export default App