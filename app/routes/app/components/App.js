// @flow
import React, { Component } from 'react'
import Nav from './components/Nav.js'
import styles from './App.scss'

class App extends Component {
  componentWillMount() {
    const { fetchTicker, fetchBalance } = this.props
    
    fetchTicker()
    fetchBalance()
  }

  render() {
    const { ticker, balance, children } = this.props
    return (
      <div>
        <Nav ticker={ticker} balance={balance} />
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